import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable} from 'rxjs';
import { AppComponent} from "../app.component"

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string) :Promise<any>  {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        return value
        
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        return null
      });    
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log(value)
        firebase.firestore().collection("guests").where("uid","==",value.user.uid).get()
        .then(userGuestProfile=>{
          userGuestProfile.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots           
            var profile = doc.data()
            if(profile.isAdmin){                       
            }        
        });
        })
        
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}