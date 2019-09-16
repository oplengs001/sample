import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';

import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Announcement {
  uid?: string,
  title: string,
  body: string,
  date_posted: number,  
  image?: string,
  notif_icon?: string
}
@Injectable({
  providedIn: 'root'
})
export class AnnouncementSaveService {
  private announcements: Observable<Announcement[]>;
  private AnnouncementCollection: AngularFirestoreCollection<Announcement>;

  constructor(private afs: AngularFirestore) {
    this.AnnouncementCollection = this.afs.collection<Announcement>('announcements');
    this.announcements = this.AnnouncementCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  
  getAnnouncements(): Observable<Announcement[]> {
    return this.announcements;
  }

  saveAnnouncement(announcement: Announcement): Promise<DocumentReference> {
    return this.AnnouncementCollection.add(announcement);
  }

  deleteGuest(id: string): Promise<void> {
    return this.AnnouncementCollection.doc(id).delete();
  }
 
}
