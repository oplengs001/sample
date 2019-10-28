import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImagesService } from "../uploads/images.service"
export interface Itenerary {
  uid?: string,
  image_url: string,
  name: string,  
  location: string,
  position : number,
}

@Injectable({
  providedIn: 'root'
})
export class SlidingContentService {
  private events: Observable<Itenerary[]>;
  private eventsColletion :AngularFirestoreCollection<Itenerary>

  constructor(
    private afs: AngularFirestore,
    
    ) {
    this.eventsColletion = this.afs.collection<Itenerary>('events');
    this.events = this.eventsColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  getEvents(): Observable<Itenerary[]> {
 
    return this.events;
  }
  addEvent(event: Itenerary): Promise<any> {
    
    return this.eventsColletion.doc(event.uid).set(event);
  }
  deleveEvent(id: string): Promise<void> {
    return this.eventsColletion.doc(id).delete();
  }
}

