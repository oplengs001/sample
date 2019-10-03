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
      url: '/home',
      icon: 'card'
    }, 
    {
      title: 'Getting There',
      url: '/ceremony',
      icon: 'airplane'
    },    
    {
      title: 'Accommodation',
      url: '/itenerary',
      icon: 'bed'
    },
    {
      title: 'Rentals',
      url: '/reception',
      icon: 'pricetag'
    },   
    {
      title: 'Wedding Weather',
      url: '/announcements',
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
