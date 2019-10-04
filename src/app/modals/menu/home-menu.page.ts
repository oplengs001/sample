import { Component, OnInit ,Injectable } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from "../../animations/animations"

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.page.html',
  styleUrls: ['./home-menu.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class HomeMenuPage implements OnInit {
  appPages = [
    {
      title: 'VISAS',
      url: '/visas',
      icon: 'card'
    }, 
    {
      title: 'Getting There',
      url: '/getting-there',
      icon: 'airplane'
    },    
    {
      title: 'Accommodation',
      url: '/accomodations',
      icon: 'bed'
    },
    {
      title: 'Rentals',
      url: '/rentals',
      icon: 'pricetag'
    },   
    {
      title: 'Wedding Weather',
      url: '/wedding-weather',
      icon: 'rainy'
    }  
  ]; 

  constructor(
    private modalctrl: ModalController,
  ) { }

  ngOnInit() {
  }
  async closeModal() {  
    await this.modalctrl.dismiss();
  }
  async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalctrl.create({
          component: HomeMenuPage,     
          enterAnimation: myEnterAnimation,
          leaveAnimation: myLeaveAnimation
    });          
    await modal.present();
  }
}
