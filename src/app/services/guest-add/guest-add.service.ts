import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    return this.GuestCollection.doc<Guest>(id).valueChanges().pipe(
      take(1),
      map(guest => {
        guest.uid = id;
        return guest
      })
    );
  }
 
  addGuest(guest: Guest): Promise<any> {
    return this.GuestCollection.doc(guest.uid).set(guest);
  }
  async addGroupToGuest (uid:string,group_id:string){    
    return  await this.afs.firestore.collection('guests')
    .doc(uid)
    .update(
      {
        "chat_id":[group_id]
      }
    )
    .then(res =>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  async addGroupToGuestMultiple (group_id: string, guest_ids:any):Promise<any> {    
   
      const snapshot = await this.afs.firestore.collection('guests').get()
      snapshot.docs.map(doc => {
        var guest = doc.data()                
          if(guest_ids.includes(guest.uid)){
            this.addGroupToGuest(guest.uid,group_id)
          }            
        }
      );  

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
