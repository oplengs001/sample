import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AnnouncementSaveService, Announcement } from "../services/announcements/announcement-save.service"
import { ToastService } from '../services/toaster/toast-service';
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
    private toastService : ToastService
    
    ) { }

  ngOnInit() {
    
  }
  sendMessage() {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json' )
    .set('Authorization' , 'key=AIzaSyDSNAyyH5RbR6bQaOQ6O26t-iUw0_GCVYA')   
    let postData =  {
        "notification" :{
            "title": this.message_body.title,
            "text": this.message_body.body
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
      }
      console.log(data);

     }, error => {
      console.log(error);
    });
  }
    
}
