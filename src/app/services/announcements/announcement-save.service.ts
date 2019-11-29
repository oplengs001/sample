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
export interface AdminNotification{
  uid?: string,  
  body: string,
  title: string,  
  createdAt: number,  
  focus : string,
  status: string,
}
@Injectable({
  providedIn: 'root'
})
export class AnnouncementSaveService {
  private announcements: Observable<Announcement[]>;
  private AnnouncementCollection: AngularFirestoreCollection<Announcement>;
  private notifs : Observable<AdminNotification[]>
  private NotifCollection: AngularFirestoreCollection<AdminNotification>;  
  public RsvpNotif : any;
  public RsvpNotifCount:number
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
    this.NotifCollection = this.afs.collection<AdminNotification>('admin-notifs');
    this.notifs = this.NotifCollection.snapshotChanges().pipe(
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
  getNotifs(): Observable<AdminNotification[]> {
    return this.notifs;
  }
  saveNotif(notif: AdminNotification): Promise<DocumentReference> {
    return this.NotifCollection.add(notif);
  }
  saveAnnouncement(announcement: Announcement): Promise<DocumentReference> {
    return this.AnnouncementCollection.add(announcement);
  }
  deleteNotif(id: string): Promise<void> {
    return this.NotifCollection.doc(id).delete();
  }
  updateNotif(id:string):Promise<void>{
    return  this.NotifCollection.doc(id).update({
       status: "read",       
    })
  }
  deleteGuest(id: string): Promise<void> {
    return this.AnnouncementCollection.doc(id).delete();
  }
 
}
