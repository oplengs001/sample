import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference, DocumentChangeAction } from '@angular/fire/firestore';
import { map, take,filter, timestamp, reduce } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { debug } from 'util';
import { firestore } from 'firebase/app';
import { AnnouncementSaveService , AdminNotification} from "../announcements/announcement-save.service"
import { NotificationService } from "../alerts/notification.service"
export interface Guest {
  uid?: string,
  first_name: string,
  last_name: string,  
  number: string,
  email: string,
  chat_id : [],
  isAdmin : boolean,
  forRsvp : boolean,
  will_come : boolean
  notif_count : number,  
  color : string,
  diet_restriction: string,
  bus_reservation:  number
  reservation_status : string
}
@Injectable({
  providedIn: 'root'
})
export class GuestAddService {
  private guests: Observable<Guest[]>;
  private restricted_guests: Observable<Guest[]>;
  private bus_reservations: Observable<Guest[]>;
  private GuestCollection: AngularFirestoreCollection<Guest>;
  public all_guests : any
  public diet_guests : any
  public bus_guests : any
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
    this.restricted_guests = this.GuestCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })    
    )    
    this.bus_reservations = this.GuestCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })    
    )   
  }

  getGuests(): Observable<Guest[]> {
  
    return this.guests;
  }
  getRestrictedGuests(): Observable<Guest[]> {
    return this.restricted_guests
  }
  getBusReservations(): Observable<Guest[]> {
    return this.bus_reservations
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

  getGuestSingle(id: string):Promise<any> {
  return  firestore().collection("guests").doc(`${id}`).get().then( userGuestProfile=>{
      
      return userGuestProfile.data()
    })  
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
  updateDietaryRestriction(uid:string,diet_restriction:string):Promise<void>{        
    return this.GuestCollection.doc(uid).update({
      diet_restriction: diet_restriction
    })
  }
  updateBusReservation(uid:string,seat_count:number):Promise<void>{        
    return this.GuestCollection.doc(uid).update({
      bus_reservation: seat_count,
      reservation_status: false
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
        focus : decision,
        guest : `${first_name} ${last_name}`,
        guest_uid : uid 
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
