import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AnnouncementSaveService, Announcement } from "../services/announcements/announcement-save.service"
import { ToastService } from '../services/toaster/toast-service';
import { AlertController} from '@ionic/angular';
import { ActionClass } from '../gallery-action-sheet/actionsheet'
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
    public http: HttpClient,
    private announcementService : AnnouncementSaveService,
    private toastService : ToastService,
    private actions : ActionClass, 
  
    ) { }

  ngOnInit() {
  }
  sendMessage() {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json' )
    .set('Authorization' , 'key=AIzaSyDSNAyyH5RbR6bQaOQ6O26t-iUw0_GCVYA')   
    let postData =  {
        "notification" :{
            "title": `ANNOUNCEMENT: ${this.message_body.title}`,
            "text": this.message_body.body,
            "click_action":"FCM_PLUGIN_ACTIVITY", 
        },
        "data": 
        {
          "type":"announcement",
        },
        "priority" : "high",
        "to" : "/topics/enappd"
    }
    this.http.post("https://fcm.googleapis.com/fcm/send", postData,
    {
      headers: headers,
      observe: 'response'
    })

    .subscribe(data => {

      if(data.statusText === "OK"){
        var a_data = {
          title : this.message_body.title,
          body : this.message_body.body,
          date_posted : Date.now()
        }
        this.announcementService.saveAnnouncement(a_data)
        this.toastService.showToast("Announcement Broadcasted!")
        this.message_body.title = "",
        this.message_body.body = ""
      }
      console.log(data);

     }, error => {
      console.log(error);
    });
  }
  async AnnouncementConfirm() {
    if(this.message_body.title === '' || this.message_body.body === ''){
      this.actions.inputAlert()
    }else{
      let message = "You are about to Create an Announcement"
      this.actions.confirmationMessage(message).then(res=>{  
        if(res){     
          this.sendMessage() 
        }
      })
    } 
   
  }
  
}
