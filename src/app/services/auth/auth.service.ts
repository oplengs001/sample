import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable} from 'rxjs';
import { AppComponent} from "../../app.component"
import { async } from 'q';
import { promise } from 'protractor';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  userDetails: firebase.User = null

  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
    this.user.subscribe((user) => {
      if (user) {
        this.userDetails = user;
      }
      else {
        this.userDetails = null;
      }
   });
  }
  authenticated(): boolean {
    // consider changing to 'return this.userDetails != null'
      if (this.userDetails == null ) {
         return false;
      } else {
         return true;
      }
  }
  currentUserId(): string {
    return this.userDetails.uid
  }
  currentUserDisplayName(): string {
    return this.userDetails.displayName || this.userDetails.email; 
  }
  currentUserData(user_id : string):Promise<any> {   
    return firebase.firestore().collection("guests").where("uid","==",user_id).get()
      .then( userGuestProfile=>{
        var profile 
          userGuestProfile.forEach( function(doc) {
            // doc.data() is never undefined for query doc snapshots      
            profile = doc.data()             
          });
        return profile
      })
  }
  currentUserObservable(): any {
    return this.firebaseAuth.idTokenResult
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

  login(email: string, password: string) : Promise<any> {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then((user)=>{
          console.log("logged in")
        }
      )
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