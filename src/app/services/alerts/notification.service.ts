import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json' )
  .set('Authorization' , 'key=AIzaSyDSNAyyH5RbR6bQaOQ6O26t-iUw0_GCVYA')
  constructor( 
    public http: HttpClient,
    
    
    ) { }

    
    createNotif(topic:string){
      
      var object_returns : any
      let postData =  {
          "notification" :{
              "title": topic,
              "text": "New Message From"
          },
          "priority" : "high",
          "to" : `/topics/${topic}`
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
