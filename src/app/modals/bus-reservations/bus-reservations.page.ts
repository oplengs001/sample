import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { GuestAddService } from "../../services/guest-add/guest-add.service"
import { AuthService } from "../../services/auth/auth.service"
@Component({
  selector: 'app-bus-reservations',
  templateUrl: './bus-reservations.page.html',
  styleUrls: ['./bus-reservations.page.scss'],
})
export class BusReservationsPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private guestCtrl: GuestAddService,
    private authServ : AuthService
  ) { }

  ngOnInit() {
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
}
