import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json' )
  .set("Accept", "application/json")
  .set('Authorization' , 'key=AIzaSyDSNAyyH5RbR6bQaOQ6O26t-iUw0_GCVYA')

  constructor( 
    public http: HttpClient,        
    ) { }    
    createNotif(topic:string,group_name : string ,sender_id:string,content:any){    
      var object_returns : any
      let postData =  {
          "notification" :{
              "title": group_name,
              "text": `${content.first_name} ${content.last_name}: ${content.content}`,
              "click_action":"FCM_PLUGIN_ACTIVITY", 
          },
          "data": 
          {
            "type":"chat",
            "group": group_name,
            "sender_id" : sender_id 
          },
          "tag " : topic,
          "priority" : "high",
          "to" : `/topics/${topic}`
      }
      
      this.http.post("https://fcm.googleapis.com/fcm/send", postData,
      {
        headers: this.headers,
        observe: 'response'
      })
      .subscribe(data => {
        console.log(data)
        if(data.statusText === "OK"){   
          console.log("ok")
          object_returns = "OK"
        }  
      }, error => {
        console.log(error)
        object_returns = error

      });
      return object_returns 
    }
    AdminNotif(title : string ,body:string,){
      
      var object_returns : any
      let postData =  {
          "notification" :{
              "title": title,
              "text": body,
              "click_action":"FCM_PLUGIN_ACTIVITY", 
          },
          "data": 
          {
            "type":"adminNotif",
            "data_body": body,
          },
          "tag " : "adminNotif",
          "priority" : "high",
          "to" : `/topics/adminNotif`
      }
      this.http.post("https://fcm.googleapis.com/fcm/send", postData,
      {
        headers: this.headers,
        observe: 'response'
      })
      .subscribe(data => {

        if(data.statusText === "OK"){   
          console.log("ok")
          object_returns = "OK"
        }  
      }, error => {
        console.log(error)
        object_returns = error

      });
      return object_returns 
    }

}
