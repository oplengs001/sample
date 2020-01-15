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
    private guestCtrl: GuestAddService,
    private authServ : AuthService
  ) { }

  ngOnInit() {
  this.guestsSubs = this.guestCtrl.getBusReservations().subscribe(data=>{
         this.guests = data.filter(guest => guest.bus_reservation !== undefined && guest.bus_reservation !== 0)        
    })
  }
  ngOnDestroy(){
    this.guestsSubs.unsubscribe()
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
}
