import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { GeneralInfoService } from '../content/general-info.service'
import { Guest } from "../guest-add/guest-add.service"
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
    public gInfo : GeneralInfoService
    ) { }    
    createNotif(topic:string,group_name : string ,sender_id:string,content:any){    
      var object_returns : any
      let postData =  {
          "notification" :{
              "title": group_name,
              "text": `${content.first_name} ${content.last_name}: ${content.content}`,
              "click_action":"FCM_PLUGIN_ACTIVITY", 
              "sound": "2",
          },
          "data": 
          {
            "type":"chat",
            "group": topic,
            "vibrate": "300",
            "sender_id" : sender_id,
          },
          "tag " : topic,
          "priority" : "high",
          "to" : `/topics/${topic}`
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
        var {api} = content
        let postData = {
          "first_name" : guest.first_name,
          "last_name" : guest.last_name,
          "email" : guest.email,
          "password" : password
        }        
        this.httpIon.setDataSerializer("json")
        this.httpIon.sendRequest(`${api}/guests/send-invite-email`,{
          method:"post",
          data: postData,
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
        }).then(data=>{
          console.log(data)
        }).catch(err=>{
          console.log(err)
        })
      })
    }
}
