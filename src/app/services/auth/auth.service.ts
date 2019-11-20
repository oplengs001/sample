import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable} from 'rxjs';
import { environment } from "../../../environments/environment"
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  userDetails: firebase.User = null
  public userGuestDetails : any
  constructor(
    
    private firebaseAuth: AngularFireAuth
    
    ) {
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
  currentUserData():Promise<any> {    
    return firebase.firestore().collection("guests").doc(this.currentUserId()).get()
      .then( userGuestProfile=>{                      
        this.userGuestDetails = userGuestProfile.data()
        return userGuestProfile.data()
      })
  }
  isAdmin(){        
    return this.userGuestDetails.isAdmin
  }
  currentUserObservable(): any {
    return this.firebaseAuth.idTokenResult
  }
  getUserDataByID(id):Promise<any> {   
    return firebase.firestore().collection("guests").doc(id).get()
      .then( userGuestProfile=>{      
        return userGuestProfile.data()
      })
  }
  getAllUsers():Promise<any> {   
    return firebase.firestore().collection("guests").get()
      .then( userGuestProfile=>{      
        let {docs} = userGuestProfile
        let items = docs.map(doc=>{
          return doc.data()
        })      
        return  items
      })
  }
  signup(email: string, password: string) :Promise<any>  {
    return this.firebaseAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        
        return value
        
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        return err
      });    
  }
  // this needs to be fixed
  workAroundSignUp(email: string, password: string) :Promise<any>  {    
    var secondaryApp = firebase.initializeApp(environment.firebase, "Secondary");
    return secondaryApp.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        secondaryApp.auth().signOut();
        secondaryApp.delete()
        return value
        
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        return err
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
      .signOut().then(() => {
        console.log("logout")
     });;
  }

}