import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { GeneralInfoService } from '../content/general-info.service'
import { Guest } from "../guest-add/guest-add.service"
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private IonHeader = {
    "Content-Type": "application/json",
    "Authorization" :'key=AIzaSyDSNAyyH5RbR6bQaOQ6O26t-iUw0_GCVYA'
  }
  constructor(     
    public httpIon : HTTP,
    public gInfo : GeneralInfoService,
    public authServ : AuthService
    ) { }    
    createNotif(topic:string,group_name : string ,sender_id:string,content:any,image_url:string){    
      var object_returns : any
      var content_text = content.content;
      if(image_url.length){
        content_text = "Sent a photo"
      }
      let postData =  {
          "notification" :{
              "title": group_name,
              "text": `${content.first_name} ${content.last_name}: ${content_text}`,
              "click_action":"FCM_PLUGIN_ACTIVITY", 
              "sound": "2",
              "image": image_url,
              "mutable_content": true,
          },
          "data": 
          {
            "type":"chat",
            "group": topic,
            "title":group_name,
            "content" : `${content.first_name} ${content.last_name}: ${content.content}`,
            "image": image_url,
            "vibrate": "300",
            "sender_id" : sender_id,
          },
          "tag " : topic,
          "priority" : "high",
         
          "to" : `/topics/${topic}`,
      }
      this.httpIon.setDataSerializer("json")
      this.httpIon.sendRequest("https://fcm.googleapis.com/fcm/send",{
        method:"post",
        data: postData,
        headers: this.IonHeader,
      })
      .then(response => {
        // prints 200
        object_returns = "OK"
        console.log(response.status);
      })
      .catch(response => {
        // prints 403
        console.log(response)
        console.log(response.status);

        // prints Permission denied
        console.log(response.error);
        object_returns = response.error
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
              "sound": "2",
          },
          "data": 
          {
            "type":"adminNotif",
            "data_body": body,
            "vibrate": "300",
          },
          "tag " : "adminNotif",
          "priority" : "high",
          "to" : `/topics/adminNotif`
      }
      this.httpIon.setDataSerializer("json")
      this.httpIon.sendRequest("https://fcm.googleapis.com/fcm/send",{
        method:"post",
        data: postData,
        headers: this.IonHeader,
      })
      .then(response => {
        // prints 200
        object_returns = "OK"
        console.log(response.status);
      })
      .catch(response => {
        // prints 403
        console.log(response)
        console.log(response.status);

        // prints Permission denied
        console.log(response.error);
        object_returns = response.error
      });
      return object_returns 
    }
    ItineraryNotif(title : string ,body:string,){
      var object_returns : any
      let postData =  {
          "notification" :{
              "title": title,
              "text": body,
              "click_action":"FCM_PLUGIN_ACTIVITY", 
              "sound": "2",
          },
          "data": 
          {
            "type":"enappd",
            "data_body": body,
            "vibrate": "300",
          },
          "tag " : "enappd",
          "priority" : "high",
          "to" : `/topics/enappd`
      }
      this.httpIon.setDataSerializer("json")
      this.httpIon.sendRequest("https://fcm.googleapis.com/fcm/send",{
        method:"post",
        data: postData,
        headers: this.IonHeader,
      })
      .then(response => {
        // prints 200
        object_returns = "OK"
        console.log(response.status);
      })
      .catch(response => {
        // prints 403
        console.log(response)
        console.log(response.status);

        // prints Permission denied
        console.log(response.error);
        object_returns = response.error
      });
      return object_returns 
    }
    AnnouncementNotif(title : string ,body:string,){
        var object_returns : any
       let postData =  {
          "notification" :{
            "title": `ANNOUNCEMENT: ${title}`,
            "text": body,   
            "click_action":"FCM_PLUGIN_ACTIVITY", 
            "sound": "2",
          },
          "data": 
          {
            "type":"announcement",
            "data_body": body,
            "vibrate": "300",
          },
          "tag " : "enappd",
          "priority" : "high",
          "to" : `/topics/enappd`
      }
      this.httpIon.setDataSerializer("json")
      this.httpIon.sendRequest("https://fcm.googleapis.com/fcm/send",{
        method:"post",
        data: postData,
        headers: this.IonHeader,
      })
      .then(response => {
        // prints 200
        return "OK"
    
      })
      .catch(response => {
        // prints 403
        console.log(response)
        console.log(response.status);

        // prints Permission denied
        console.log(response.error);
        return response.error
      });
    }
    welcomeEmail(guest:Guest,password:string){
      this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
        var content = data[0]        
        var {welcome_email_api,api} = content
        let postData = {
          "guest": guest
        }        
        this.httpIon.setDataSerializer("json")
        this.httpIon.sendRequest(`${api}${welcome_email_api}`,{
          method:"post",
          data: postData,
          headers : {
            "Content-Type": "application/json",
            "Authorization": `WDV ${this.authServ.currentUserId()}`
          }
        }).then(data=>{
          console.log(data)
        }).catch(err=>{
          console.log(err)
        })
      })
    }
    ConfirmationEmail(guest_id:string,type:string,response?:string,reason?:string){
      this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
        var api_url = type==="diet"?"/guests/diet-restriction-confirmation":"/guests/bus-reservation-response"
        var content = data[0]        
        var {api} = content
        let postData = {
          "id" : guest_id,
          "response" : response,    
          "reason" :reason 
        }        
        this.httpIon.setDataSerializer("json")
        this.httpIon.sendRequest(`${api}${api_url}`,{
          method:"post",
          data: postData,
          headers : {
            "Authorization": `WDV ${this.authServ.currentUserId()}`
          }
        }).then(data=>{
          console.log(data)
        }).catch(err=>{
          console.log(err)
        })
      })
    }
}
