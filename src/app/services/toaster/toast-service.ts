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
  showNotif(msg:string,chat_data:any){
   this.toastCtrl.create({
      header: msg,     
      position: 'top',
      showCloseButton: true,
      buttons: [
        {
          side: 'start',        
          text: 'Show',
          handler: () => {
            var url = this.url_links[chat_data.type]
            if(chat_data.type ==="chat"){
             url = url+`?group_id=${chat_data.group}`
            }else{
              this.router.navigateByUrl(url);
            }
            console.log(url)
        
          }
        }, {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).then(toast => toast.present());
  }
}
