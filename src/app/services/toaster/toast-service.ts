import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {  Router, ActivatedRoute } from '@angular/router';
import { TransitionsService } from '../native/transitions.service';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private url_links = {
    announcement:"/announcements",
    chat:"/messages"
    }
    
  constructor( 
    private toastCtrl: ToastController,
    private router: Router,
    private trans : TransitionsService,
    private a_route : ActivatedRoute
    ) {
    
   }

  showToast(msg) {    
    this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: "top"
    }).then(toast => toast.present());
  }
  showStayingToast(msg) {    
    this.toastCtrl.create({
      message: msg,
      position: "top",
      color: 'danger',
      showCloseButton: true,
    }).then(toast => toast.present());
  }
  tryDismissAll(){
    try {
      this.toastCtrl.dismiss();
   } catch(e) {}
  }
  getUrl(){
    return this.router.url
    
  }
  showNotif(msg:string,data:any){
  this.tryDismissAll()

   this.toastCtrl.create({
      header: msg,     
      position: 'top',
      buttons: [
        {
          side: 'start',        
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl("/announcements");
          }
        },
        {
          side: 'end',        
          text: 'Dismiss',
          handler: () => {
            return null
          }
        }
      ]
    }).then(toast => toast.present());
  }
  messageNotif(msg:string,data:any){
  var url = `/messages?group_id=${data.group}`
  if(url === this.getUrl()){
    return null 
  }else{
    this.tryDismissAll()
    this.toastCtrl.create({
       header: msg,     
       position: 'top',
       buttons: [
         {
           side: 'start',        
           text: 'Show',
           handler: () => {
             this.router.navigateByUrl(url);
           }
         },
         {
          side: 'end',        
          text: 'Dismiss',
          handler: () => {
            return null
          }
        }
       ]
     }).then(toast => toast.present());
   }
  }
 
   adminToast(msg:string,data:any){
    this.tryDismissAll()
      this.toastCtrl.create({
         header: msg,     
         position: 'top',
         buttons: [
           {
             side: 'start',        
             text: 'Show',
             handler: () => {
              this.trans.reRoute("/rsvp-list")
             }
           },
           {
            side: 'end',        
            text: 'Dismiss',
            handler: () => {
              return null
            }
          }
         ]
       }).then(toast => toast.present());
     }
}
