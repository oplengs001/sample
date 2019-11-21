import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { debug } from 'util';

export interface Guest {
  uid?: string,
  first_name: string,
  last_name: string,
  position: string,  
  number: string,
  email: string,
  chat_id : [],
  isAdmin : boolean
}
@Injectable({
  providedIn: 'root'
})
export class GuestAddService {
  private guests: Observable<Guest[]>;
  private GuestCollection: AngularFirestoreCollection<Guest>;

  constructor(private afs: AngularFirestore) {
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
 
  deleteGuest(id: string): Promise<void> {
    return this.GuestCollection.doc(id).delete();
  }
  
}
