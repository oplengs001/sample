import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
@Component({
  selector: 'app-wedding-weather',
  templateUrl: './wedding-weather.page.html',
  styleUrls: ['./wedding-weather.page.scss'],
})
export class WeddingWeatherPage implements OnInit {

  constructor(private homeMenu: HomeMenuPage) { }

  ngOnInit() {
  }

}
