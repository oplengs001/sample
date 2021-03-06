import { Component, OnInit } from '@angular/core';
import { AnnouncementSaveService, Announcement } from "../services/announcements/announcement-save.service"
import { ToastService } from '../services/toaster/toast-service';
import { AlertController} from '@ionic/angular';
import { ActionClass } from '../gallery-action-sheet/actionsheet'
import { NotificationService } from "../services/alerts/notification.service"
interface NotifMessage  {
  title : string,
  body : string
}
@Component({
  selector: 'app-admin-announcement',
  templateUrl: './admin-announcement.page.html',
  styleUrls: ['./admin-announcement.page.scss'],
})

export class AdminAnnouncementPage implements OnInit {

  message_body : NotifMessage = {
    title : '',
    body : ''
  }
  announcement_body : Announcement
 
  constructor( 
    private announcementService : AnnouncementSaveService,
    private toastService : ToastService,
    private actions : ActionClass, 
    private notifs : NotificationService
  
    ) { }

  ngOnInit() {
  }
  sendMessage() {  
      var a_data = {
        title : this.message_body.title,
        body : this.message_body.body,
        date_posted : Date.now()
      }
      this.announcementService.saveAnnouncement(a_data).then(data=>{
        if(data){
          this.notifs.AnnouncementNotif(this.message_body.title,this.message_body.body)
          this.toastService.showToast("Announcement Broadcasted!")
          this.message_body.title = "",
          this.message_body.body = ""
        }else{
          this.toastService.showToast("Announcement Cannot be created something wrong")
        }
      })                   

  }
  async AnnouncementConfirm() {
    if(this.message_body.title === '' || this.message_body.body === ''){
      this.actions.inputAlert()
    }else{
      let message = "You are about to create an announcement."
      this.actions.confirmationMessage(message).then(res=>{  
        if(res){     
          this.sendMessage() 
        }
      })
    } 
   
  }
  
}
