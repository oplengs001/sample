import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Guest {
  id?: string,
  first_name: string,
  last_name: string,
  position: string,  
  number: string,
  email: string,
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
        guest.id = id;
        return guest
      })
    );
  }
 
  addGuest(guest: Guest): Promise<DocumentReference> {
    return this.GuestCollection.add(guest);
  }
 
  updateGuest(guest: Guest): Promise<void> {
    return this.GuestCollection.doc(guest.id).update(
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
