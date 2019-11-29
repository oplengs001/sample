import { Component, OnInit } from '@angular/core';
import { AnnouncementSaveService ,AdminNotification } from "../../services/announcements/announcement-save.service"
import { Observable } from 'rxjs';
import { ActionClass } from "../../gallery-action-sheet/actionsheet"
@Component({
  selector: 'app-rsvp-list',
  templateUrl: './rsvp-list.page.html',
  styleUrls: ['./rsvp-list.page.scss'],
})
export class RsvpListPage implements OnInit {
  private adminNotifs: Observable<AdminNotification[]>;
  constructor(
    private announcementServices: AnnouncementSaveService ,
    private actions : ActionClass
  ) { }

  ngOnInit() {
    this.adminNotifs = this.announcementServices.getNotifs()
  }
  updateNotif(notif:any){
    let {id,body} = notif
    this.actions.confirmationMessage("You are marking this notification as Read",body).then((data)=>{
      if(data){
        this.announcementServices.updateNotif(id)
      }
    })

  }
}
