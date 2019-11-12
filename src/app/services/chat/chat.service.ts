import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../alerts/notification.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { async } from '@angular/core/testing';
import { promise } from 'protractor';
export interface GroupChat {
  count: number,
  createdAt : number,
  group_name : string,
  message:[]
  inbox:[]
}
@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private group_chats: Observable<GroupChat[]>;
  private gcCollection: AngularFirestoreCollection<GroupChat>;
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private notif : NotificationService,    
  ){

    this.gcCollection = this.afs.collection<GroupChat>('chats');
    this.group_chats = this.gcCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

  }
  getAllChat(): Observable<GroupChat[]> {
    return this.group_chats;
  }
  // ref.parent.orderBy("messages.createdBy").limit(10).get()
  get(chatId) {  
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {        
              
          return { id: doc.payload.id, ...doc.payload.data()};
        })
      );
  }  
  group_members_format (members:any,forEdit : boolean,group_id:string){
    return new Promise<any>(async(resolve, reject) => {
      if(forEdit){
        let {inbox,messages} = await this.getChatByID(group_id),
        unique = inbox.filter((o)=> members.indexOf(o.user_id) === -1),
        reduced = unique.map(user=>{
          inbox = this.remItem(inbox,user)
        })
        inbox_format = members.map((member)=>{
          let member_inbox = inbox.find(({user_id})=> user_id === member)
            if(member_inbox !== undefined){
              return member_inbox
            }else{
              return {
                    user_id : member,
                    message_count : 0
                }
            }
        })        
        resolve({
          inbox_format :inbox_format,
          messages : messages
        })
      }else{
        var inbox_format = members.map((item)=>{
          return {
            user_id : item,
            message_count : 0
          }
        })
        resolve({
          inbox_format :inbox_format,
          messages : []
        })
      }
   
    })
  }
  remItem(arr, val) {
    for (var i = 0; i < arr.length; i++) if (arr[i] === val) arr.splice(i, 1);
    return arr;
  }
  update_inbox (chat_data){
    return new Promise<any>((resolve, reject) => {
       chat_data.ref.get().then( async doc =>{           
            var {inbox} = doc.data()           
            const  uid  = await this.auth.currentUserId();    
            var inbox_ = inbox.map((item)=>{
              if(item.user_id === uid){
                return{
                  user_id : item.user_id,
                  message_count : item.message_count
                }
              }else{
                return {
                  user_id : item.user_id,
                  message_count : item.message_count+1
                }
              }             
            })            
            resolve(inbox_)
          }
       )
    })
  }
  async seen_chat (chat_id){
    return new Promise<any>((resolve, reject) => {      
      const chat_data = this.afs.collection('chats').doc(chat_id);  
      chat_data.ref.get().then( async(doc) =>{       
           var {inbox} = doc.data()          
           var  uid  = await this.auth.currentUserId();                
           if(inbox.find(({user_id})=> user_id === uid) === undefined){// admin
             resolve(false) 
           }else{
             if(inbox.find(({user_id})=> user_id === uid).message_count == 0){//no message
               resolve(false)
             }else{//seen chat
                var inbox_count = inbox.find(({user_id})=> user_id === uid).message_count 
                inbox.find(({user_id})=> user_id === uid).message_count = 0     
                chat_data.update({              
                "inbox" : inbox,
                }).then(()=>{
                  resolve({
                   continue: true,
                   count : inbox_count
                  })
                }).catch((error)=>{
                  reject(error)
                });
             }
           }      
         }
      )
   })
  } 
  async create(group_details : any,group_members:any,forEdit:boolean):Promise<any> {
    const  uid  = await this.auth.currentUserId();
    var {group_name,group_id} = group_details    
    let format  = await this.group_members_format(group_members,forEdit,group_id)    
    const data = {
      uid,
      group_name : group_name, 
      createdAt: Date.now(),
      count: 0,
      messages: format.messages,
      inbox: format.inbox_format
    };
    return await this.afs.collection('chats').doc(group_id).set(data)        
  }
  async sendMessage(chatId, content) :Promise <any>{
    const  uid  = await this.auth.currentUserId();
    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {      
      const ref = this.afs.collection('chats').doc(chatId);    
      const inbox_value = await this.update_inbox(ref)      
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data),
        "inbox" : inbox_value,
      }).then(()=>{
        this.notif.createNotif(chatId,uid)
        console.log(data)
        return data
      }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return error
      });
    }
  }
  async joinUsers(chat$: Observable<any>) {    
    let chat;
    const joinKeys = {};
    
    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));
  
        // Firestore User Doc Reads
        const userDocs = uids.map(u =>         
          firestore().collection("guests").doc(`${u}`).get().then( userGuestProfile=>{
            return userGuestProfile.data()
          })
        );
        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        
        return chat;
      })
    );
  }
  get_inbox (chat_id){
    return new Promise<any>((resolve, reject) => { 
      const chat_data = this.afs.collection('chats').doc(chat_id);  
      chat_data.ref.get().then( async(doc) =>{    
        const  uid  = await this.auth.currentUserId();   
        var {inbox} = doc.data()        
        resolve(inbox.find(({user_id})=> user_id === uid).message_count) 
      }) 
    })
  }
  getChatByID(chat_id){
    return new Promise<any>((resolve, reject) => { 
      const chat_data = this.afs.collection('chats').doc(chat_id);  
      chat_data.ref.get().then((doc) =>{          
        var chat = doc.data()        
        resolve(chat)
      }) 
    })
  }
}
