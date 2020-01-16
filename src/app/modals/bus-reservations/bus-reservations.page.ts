import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { GuestAddService } from "../../services/guest-add/guest-add.service"
import { AuthService } from "../../services/auth/auth.service"
import { Observable,Subscription } from 'rxjs';
@Component({
  selector: 'app-bus-reservations',
  templateUrl: './bus-reservations.page.html',
  styleUrls: ['./bus-reservations.page.scss'],
})
export class BusReservationsPage implements OnInit {
  public guests: any;
  public guestsSubs : Subscription;
  constructor(
    private modalCtrl: ModalController,
    private guestServe: GuestAddService,
    private authServ : AuthService,
  ) { }

  ngOnInit() {
 
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
}
