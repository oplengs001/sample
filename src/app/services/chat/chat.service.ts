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
    private notif : NotificationService
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
  getV(chatId){
    return firestore().collection("chats").doc(chatId).get()
      .then( chat=>{              
        return chat
      })
  }  
  
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
  limitData(documentData,limit){


  }
  group_members_format (members){
    return new Promise<any>((resolve, reject) => {
      
      var inbox_format = members.map((item)=>{
        return {
          user_id : item,
          message_count : 0
        }
      })
      resolve(inbox_format)
    })
  }
  async create(group_details : any,group_members:any) {    

    const  uid  = await this.auth.currentUserId();
    
    var members_format = await this.group_members_format(group_members)
    var {group_name,group_id} = group_details    
    const data = {
      uid,
      group_name : group_name, 
      createdAt: Date.now(),
      count: 0,
      messages: [],
      inbox: members_format
    };
    return await this.afs.collection('chats').doc(group_id).set(data)        
  }

  async sendMessage(chatId, content) {
    const  uid  = await this.auth.currentUserId();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      }).then(()=>{
        this.notif.createNotif(chatId,uid)
        console.log(data)
      }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
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
}
