import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { GuestAddService } from "../../services/guest-add/guest-add.service"
import { AuthService } from "../../services/auth/auth.service"
@Component({
  selector: 'app-diet-rest',
  templateUrl: './diet-rest.page.html',
  styleUrls: ['./diet-rest.page.scss'],
})
export class DietRestPage implements OnInit {
  diet_restriction : string
  constructor(
    private modalCtrl: ModalController,
    private guestCtrl: GuestAddService,
    private authServ : AuthService
    ) { }

  ngOnInit() {
  }
  confirmRestriction(){
    console.log(this.diet_restriction)
    this.guestCtrl.updateDietaryRestriction(this.authServ.currentUserId(),this.diet_restriction)
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
}
