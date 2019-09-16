import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {  Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
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
  showNotif(msg){
   this.toastCtrl.create({
      header: "New Notification Message!",     
      position: 'top',
      buttons: [
        {
          side: 'start',        
          text: 'Show',
          handler: () => {
            this.router.navigateByUrl('/announcements');
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
