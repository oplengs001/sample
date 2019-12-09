import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take,flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { Injectable } from '@angular/core';

export interface Info {
  uid?: string,
  wedding_image: string,
  location_name: string,  
  location_place: string,
  place_description : string,
  locationRef : string,
  weddingDate : string,
  dress_code : string,  
  dining_list : any  
  groom_name : string,
  bride_name : string,
  b_mother_name:string,
  b_father_name: string
  g_mother_name :string,
  g_father_name : string
  invitation_f_text : string,
  weddingDateText : string,
  weddingYearText : string,
  weddingTimeText : string,
  invitation_last_text: string,  
  ref: DocumentReference,
}
@Injectable({
  providedIn: 'root'
})
export class GeneralInfoService {
  private g_info: Observable<Info[]>;
  private g_infoCollection :AngularFirestoreCollection<Info>

  constructor(
    private afs: AngularFirestore,
  ) {
    this.g_infoCollection = this.afs.collection<Info>('info');
    this.g_info = this.g_infoCollection.snapshotChanges().pipe(
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
  getInfo(): Observable<Info[]> { 
    return this.g_info;
  }
  updateInfo(infoRef:DocumentReference,item:any){
    infoRef.update(item).then(()=>{
      console.log("updated")
    }).catch((error)=>{
      console.log(error)
    });
  }
  getWeddingInfoTakeOne(){    
    return this.g_infoCollection.
      valueChanges().pipe(take(1),map(
        (info) => info
      )
  )
} 
}
