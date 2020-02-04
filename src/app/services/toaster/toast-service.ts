import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {  Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private url_links = {
    announcement:"/announcement",
    chat:"/messages"
    }
    
  constructor( 
    private toastCtrl: ToastController,
    private router: Router
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
  showNotif(msg:string,data:any){
  this.tryDismissAll()
   this.toastCtrl.create({
      header: msg,     
      position: 'top',
      showCloseButton: true,
      buttons: [
        {
          side: 'start',        
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl("/announcement");
          }
        }
      ]
    }).then(toast => toast.present());
  }
  messageNotif(msg:string,data:any){
  this.tryDismissAll()
    this.toastCtrl.create({
       header: msg,     
       position: 'top',
       showCloseButton: true,
       buttons: [
         {
           side: 'start',        
           text: 'OK',
           handler: () => {
             var url = `messages?group_id=${data.group}`
             this.router.navigateByUrl(url);
           }
         }
       ]
     }).then(toast => toast.present());
   }
}
