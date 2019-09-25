import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit {
  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };
  constructor() { }
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }
  ngOnInit() {
  }

}
