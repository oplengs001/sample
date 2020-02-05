import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { FlightMapPage } from '../../modals/map/flight-map.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { GeneralInfoService } from 'src/app/services/content/general-info.service';
@Component({
  selector: 'app-getting-there',
  templateUrl: './getting-there.page.html',
  styleUrls: ['./getting-there.page.scss'],
})
export class GettingTherePage implements OnInit {

  constructor(
    private homeMenu: HomeMenuPage,
    private flightMap: FlightMapPage,
    private annServe: AnnouncementSaveService,
    private gInfo :GeneralInfoService
    ) { }

  ngOnInit() {
  }
  openMap (){
    this.flightMap.openModal()
  }

}
