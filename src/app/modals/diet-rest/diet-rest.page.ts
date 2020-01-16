import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { AuthService } from "../../services/auth/auth.service"
import { Observable,Subscription } from 'rxjs';
import { GuestAddService,} from "../../services/guest-add/guest-add.service"
@Component({
  selector: 'app-diet-rest',
  templateUrl: './diet-rest.page.html',
  styleUrls: ['./diet-rest.page.scss'],
})
export class DietRestPage implements OnInit  {
  diet_restriction : string
  public guests: any;
  public guestsSubs : Subscription;
  constructor(
    private modalCtrl: ModalController,
    private authServ : AuthService,
    private guestServe : GuestAddService,  
    ) { }

  ngOnInit(){

  }
  ionViewDidEnter(){
  
  }
  ionViewDidLeave(){
    this.guests = []    
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
}
