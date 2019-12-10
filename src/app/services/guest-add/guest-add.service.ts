import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take, timestamp } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { debug } from 'util';
import { AnnouncementSaveService , AdminNotification} from "../announcements/announcement-save.service"
import { NotificationService } from "../alerts/notification.service"
export interface Guest {
  uid?: string,
  first_name: string,
  last_name: string,
  position: string,  
  number: string,
  email: string,
  chat_id : [],
  isAdmin : boolean,
  forRsvp : boolean,
  will_come : boolean
  notif_count : number,
  extra: number
  color : string,
}
@Injectable({
  providedIn: 'root'
})
export class GuestAddService {
  private guests: Observable<Guest[]>;
  private GuestCollection: AngularFirestoreCollection<Guest>;

  constructor(
    
    private afs: AngularFirestore,
    private announcementService : AnnouncementSaveService,
    private notificationService : NotificationService
    ) {
    this.GuestCollection = this.afs.collection<Guest>('guests');
    this.guests = this.GuestCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getGuests(): Observable<Guest[]> {
  
    return this.guests;
  }
  
  getGuest(id: string): Observable<Guest> {
    console.log(id)
    return this.GuestCollection.doc<Guest>(id).valueChanges().pipe(
      take(1),
      map(guest => {
        guest.uid = id;

        return guest
      })
    );
  }
  getGuestObs(id: string): Observable<any> {    
    return this.GuestCollection.doc<Guest>(id).snapshotChanges()
    .pipe(
      map(doc => {                    
        return { id: doc.payload.id, ...doc.payload.data()};
      })
    );
  }
  addGuest(guest: Guest): Promise<any> {
    return this.GuestCollection.doc(guest.uid).set(guest);
  }
  async addGroupToGuest (uid:string,group_id:any){    
    return  await this.afs.firestore.collection('guests')
    .doc(uid)
    .update(
      {
        "chat_id":group_id
      }
    )
    .then(res =>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  async addGroupToGuestMultiple (group_id: string, guest_ids:any , forUpdate : any):Promise<any> {                          
    guest_ids.map(async (user)=>{
      await this.afs.firestore.collection('guests').doc(user).get().then(guestData=>{
        let {chat_id} = guestData.data()
        if(!chat_id.includes(group_id)){
          chat_id.push(group_id)
        }
        this.addGroupToGuest(user,chat_id) 
      })      
    })
    forUpdate.map(user=>{ // deleting removed members      
      this.addGroupToGuest(user.uid,user.chat_id)
    })
  }

  updateGuest(guest: Guest): Promise<void> {
    return this.GuestCollection.doc(guest.uid).update(
      {       
        first_name: guest.first_name,
        last_name: guest.last_name,
        position: guest.position,
        number: guest.number,
        email: guest.email,
      }
    );
  }
  updateNotifCount(uid:string,type):Promise<void>{
    var value;
    if(type === "increment"){
      value = firebase.firestore.FieldValue.increment(1)    
    }else if(type === "clear"){
      value = 0
    }
    return this.GuestCollection.doc(uid).update({
      notif_count: value
    })
  }
  updateGuestCount(uid:string,count:number):Promise<void>{    
    return this.GuestCollection.doc(uid).update({
      extra: count
    })
  }
  updateStatus(userDetails : any ,will_come:boolean):Promise<void>{  
    let {first_name , last_name ,uid} = userDetails
    let decision  = will_come?"will attend":"will not attend"  
    let notif : AdminNotification ={
        title: "RSVP Response",
        body: `${first_name} ${last_name} responded "${decision}" on the RSVP`,
        createdAt : Date.now(),
        status : "unread",
        focus : decision
    }         
    this.notificationService.AdminNotif(notif.title,notif.body)  
    return this.announcementService.saveNotif(notif).then(()=>{
       this.GuestCollection.doc(uid).update({
        will_come: will_come, 
        color : userDetails.color || this.getRandomColor(),
        forRsvp : false
      })
    })
  }
  
  deleteGuest(id: string): Promise<void> {
    return this.GuestCollection.doc(id).delete();
  }
 
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
