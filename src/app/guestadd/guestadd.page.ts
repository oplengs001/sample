import { Component, OnInit } from '@angular/core';
import { GuestAddService, Guest } from "../services/guest-add/guest-add.service"
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toaster/toast-service';
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
    private toastService: ToastService,
    ) { }

  ngOnInit() {
  }
  addGuest() {      
  
    this.authService.signup(this.guest.email, this.password).then((value)=>{        
      if(value){
        this.guest.uid = value.user.uid
        this.guestService.addGuest(this.guest).then(() => {
          this.toastService.showToast('Guest added');
        }, err => {
          this.toastService.showToast('There was a problem adding your Guest :(');
        });
      }
    })
   
  }
  deleteGuest() {
    this.guestService.deleteGuest(this.guest.uid).then(() => {   
      this.toastService.showToast('Guest deleted');
    }, err => {
      this.toastService.showToast('There was a problem deleting your Guest :(');
    });
  }
  updateGuest() {
    this.guestService.updateGuest(this.guest).then(() => {
      this.toastService.showToast('Guest updated');
    }, err => {
      this.toastService.showToast('There was a problem updating your Guest :(');
    });
  } 
}
