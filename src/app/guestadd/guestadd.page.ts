import { Component, OnInit } from '@angular/core';
import { GuestAddService, Guest } from "../services/guest-add.service"
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
 
@Component({
  selector: 'app-guestadd',
  templateUrl: './guestadd.page.html',
  styleUrls: ['./guestadd.page.scss'],
})
export class GuestaddPage implements OnInit {

  guest: Guest = {
    first_name: '',
    last_name: '',
    position: '',  
    number: '',
    email: '',    
    isAdmin: false
  };
  password : string;
  constructor(  
    private guestService : GuestAddService,
    private authService : AuthService,
    private toastCtrl: ToastController,
    ) { }

  ngOnInit() {
  }
  addGuest() {      
  
    this.authService.signup(this.guest.email, this.password).then((value)=>{        
      if(value){
        this.guest.uid = value.user.uid
        this.guestService.addGuest(this.guest).then(() => {
          this.showToast('Guest added');
        }, err => {
          this.showToast('There was a problem adding your Guest :(');
        });
      }
    })
   
  }
  deleteGuest() {
    this.guestService.deleteGuest(this.guest.uid).then(() => {   
      this.showToast('Guest deleted');
    }, err => {
      this.showToast('There was a problem deleting your Guest :(');
    });
  }
  updateGuest() {
    this.guestService.updateGuest(this.guest).then(() => {
      this.showToast('Guest updated');
    }, err => {
      this.showToast('There was a problem updating your Guest :(');
    });
  }
  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
