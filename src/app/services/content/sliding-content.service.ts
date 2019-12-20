import { Injectable  } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take,flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImagesService } from "../uploads/images.service"
import { firestore } from 'firebase/app';
import { NotificationService } from '../alerts/notification.service';
export interface Itinerary {
  uid?: string,
  image_url: string,
  name: string,  
  location: string,
  position : number,
  image_ref : string,
  schedule : string,
  details: string
}

@Injectable({
  providedIn: 'root'
})
export class SlidingContentService {
  private events: Observable<Itinerary[]>;
  private eventsColletion :AngularFirestoreCollection<Itinerary>
  private eventRef : DocumentReference
  eventItem : Itinerary
  constructor(
    private afs: AngularFirestore,
    private imageServe : ImagesService,
    private notif : NotificationService,   
    ) {
    this.eventsColletion = this.afs.collection<Itinerary>('events');
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
          this.eventItem = <Itinerary>doc.payload.doc.data();        
        });                   
  }
  async updateEventItem(eventRef:DocumentReference, eventItem :any , to:number){   
    delete eventItem.ref
    delete eventItem.id    
    var item = <Itinerary>eventItem
    item.position = to;        
    eventRef.update(item).then(()=>{
      console.log("updated")
      this.notif.ItineraryNotif("Event Itinerary Update!",`${item.name}`)
    }).catch((error)=>{
      console.log(error)
    });
  }
  async updateEventDetails(eventRef:DocumentReference, eventItem :any){   
    // delete eventItem.ref
    // delete eventItem.id    
    // console.log(eventRef)
    var item = <Itinerary>eventItem       
    eventRef.update(item).then(()=>{      
      this.notif.ItineraryNotif("Event Itinerary Update!",`${item.name}`)
    }).catch((error)=>{
      console.log(error)
    });
  }
  getEvents(): Observable<Itinerary[]> {
 
    return this.events;
  }
  addEvent(event: Itinerary): Promise<any> {   
    return this.eventsColletion.doc(this.afs.createId()).set(event);
  }
  deleteEvent(id: string): Promise<void> {
    return this.eventsColletion.doc(id).delete();
  }
  deleteEventByRef(itemRef: DocumentReference,imageRef : string): Promise<void> {
    this.imageServe.removeImageRef({file_name:imageRef},"app-gallery")
    return itemRef.delete();
  }
  
}

