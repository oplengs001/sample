import { Component, OnInit} from '@angular/core';
import { AnnouncementSaveService ,AdminNotification } from "../../services/announcements/announcement-save.service"
import { ActionClass } from "../../gallery-action-sheet/actionsheet"
import { FooterComponent } from "../../footer/footer.component"
@Component({
  selector: 'app-rsvp-list',
  templateUrl: './rsvp-list.page.html',
  styleUrls: ['./rsvp-list.page.scss'],
})

export class RsvpListPage implements OnInit { 

  constructor(
    private announcementServices: AnnouncementSaveService ,
    private actions : ActionClass,
  ) { }

  ngOnInit() {
    // this.adminNotifs = this.announcementServices.getNotifs()

  } 
  updateNotif(notif:any){
    let {id,body} = notif
    this.actions.confirmationMessage("You are marking this notification as Read",body).then((data)=>{
      if(data){
        console.log(data)
        this.announcementServices.updateNotif(id)
      }
    })
  }
}
