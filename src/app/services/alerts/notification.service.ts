import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { GeneralInfoService } from '../content/general-info.service'
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
    welcomeEmail(first_name:string,last_name:string,email:string,number:string){
      this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
        var content = data[0]        
        var {api} = content
        let postData = {
          first_name : first_name,
          last_name : last_name,
          email : email,
          number : number
        }
        this.httpIon.sendRequest(`${api}//send`,{
          method:"post",
          data: postData,
          headers: this.IonHeader,
        })
      })
    }
}
