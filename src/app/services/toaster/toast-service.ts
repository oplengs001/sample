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
      duration: 2000
    }).then(toast => toast.present());
  }
  showNotif(msg:string,chat_data:any){
   this.toastCtrl.create({
      header: msg,     
      position: 'top',
      buttons: [
        {
          side: 'start',        
          text: 'Show',
          handler: () => {
            var url = this.url_links[chat_data.type]
            if(chat_data.type ==="chat"){
             url = url+`?group_id=${chat_data.group}`
            }
            console.log(url)
            this.router.navigateByUrl(url);
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
