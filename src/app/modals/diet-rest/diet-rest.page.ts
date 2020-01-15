import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { GuestAddService , Guest } from "../../services/guest-add/guest-add.service"
import { AuthService } from "../../services/auth/auth.service"
import { Observable,Subscription } from 'rxjs';
@Component({
  selector: 'app-diet-rest',
  templateUrl: './diet-rest.page.html',
  styleUrls: ['./diet-rest.page.scss'],
})
export class DietRestPage implements OnInit {
  diet_restriction : string
  public guests: any;
  public guestsSubs : Subscription;
  constructor(
    private modalCtrl: ModalController,
    private guestCtrl: GuestAddService,
    private authServ : AuthService
    ) { }

  ngOnInit() {
    this.guestsSubs = this.guestCtrl.getRestrictedGuests().subscribe(data=>{
         this.guests = data.filter(guest => guest.diet_restriction !== undefined && guest.diet_restriction !== "none" && guest.diet_restriction !== "")        
    })
  }
  ngOnDestroy(){
    this.guestsSubs.unsubscribe()
  }
  confirmRestriction(){
    console.log(this.diet_restriction)
    this.guestCtrl.updateDietaryRestriction(this.authServ.currentUserId(),this.diet_restriction)
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
}
