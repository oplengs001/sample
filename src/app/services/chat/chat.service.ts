import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {}

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

  async create() {
    const uid  = await this.auth.currentUserId();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('chats').add(data);

    return this.router.navigate(['chats', docRef.id]);
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
