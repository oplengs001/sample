import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { FlightMapPage } from '../../modals/map/flight-map.page'
@Component({
  selector: 'app-getting-there',
  templateUrl: './getting-there.page.html',
  styleUrls: ['./getting-there.page.scss'],
})
export class GettingTherePage implements OnInit {

  constructor(
    private homeMenu: HomeMenuPage,
    private flightMap: FlightMapPage
    
    ) { }

  ngOnInit() {
  }
  openMap (){
    this.flightMap.openModal()
  }

}
