import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.page.html',
  styleUrls: ['./home-menu.page.scss'],
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
      url: '/accomodation',
      icon: 'bed'
    },
    {
      title: 'Rentals',
      url: '/rental',
      icon: 'pricetag'
    },   
    {
      title: 'Wedding Weather',
      url: '/wedding-weather',
      icon: 'rainy'
    }  
  ]; 

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }
  async closeModal() {  
    await this.modalController.dismiss();
  }
}
