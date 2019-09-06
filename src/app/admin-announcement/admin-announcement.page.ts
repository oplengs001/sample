import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
 
  constructor( public http: HttpClient) { }

  ngOnInit() {

    
    // admin.messaging().
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
      console.log(data);

     }, error => {
      console.log(error);
    });
  }
    
}
