import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { async } from '@angular/core/testing';

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
    private router: Router
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
  get(chatId) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }
 
  async create(group_details : any) {    
    const  uid  = await this.auth.currentUserId();
    var {group_name,group_id} = group_details    
    const data = {
      uid,
      group_name : group_name, 
      createdAt: Date.now(),
      count: 0,
      messages: []
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
      });
    }
  }
  
  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};
  
    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));
  
        // Firestore User Doc Reads
        const userDocs = uids.map(u => 
            // this.afs.doc(`guest/${u}`).valueChanges()
          firestore().collection("guests").where("uid","==",u).get().then( userGuestProfile=>{
              var profile 
                userGuestProfile.forEach( function(doc) {
                  // doc.data() is never undefined for query doc snapshots      
                  profile = doc.data()             
                });
              return profile
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
