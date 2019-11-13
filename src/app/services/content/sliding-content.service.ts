import { Injectable  } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take,flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImagesService } from "../uploads/images.service"
import { firestore } from 'firebase/app';

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
  private eventRef : DocumentReference
  eventItem : Itenerary
  constructor(
    private afs: AngularFirestore,
    
    ) {
    this.eventsColletion = this.afs.collection<Itenerary>('events');
    this.events = this.eventsColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          const ref = a.payload.doc.ref
          return { id, ...data , ref};
        });
      })
    );
  }
  async updateEvent(from:number,to:number){   
      const snapshotResult = await this.afs.collection('events', ref =>
      ref.where('position', '==', from )
         .limit(1))
         .snapshotChanges()
         .pipe(flatMap(events => events));          
       snapshotResult.subscribe(doc => {        
          this.eventRef = doc.payload.doc.ref;
          this.eventItem = <Itenerary>doc.payload.doc.data();        
        });                   
  }
  async updateEventItem(eventRef:DocumentReference, eventItem :any , to:number){   
    delete eventItem.ref
    delete eventItem.id    
    var item = <Itenerary>eventItem
    item.position = to;        
    eventRef.update(item).then(()=>{
      console.log("updated")
    }).catch((error)=>{
      console.log(error)
    });
  }
  getEvents(): Observable<Itenerary[]> {
 
    return this.events;
  }
  addEvent(event: Itenerary): Promise<any> {
    debugger
    console.log
    return this.eventsColletion.doc(this.afs.createId()).set(event);
  }
  deleteEvent(id: string): Promise<void> {
    return this.eventsColletion.doc(id).delete();
  }
  deleteEventByRef(itemRef: DocumentReference): Promise<void> {
    return itemRef.delete();
  }
}

