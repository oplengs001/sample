import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { SharedComponent } from 'src/app/shared-component/shared';
@Component({
  selector: 'app-wedding-weather',
  templateUrl: './wedding-weather.page.html',
  styleUrls: ['./wedding-weather.page.scss'],
})
export class WeddingWeatherPage implements OnInit {

  constructor(
    private homeMenu: HomeMenuPage,
    private sharedComps : SharedComponent,
    private annServe: AnnouncementSaveService
    ) { }

  ngOnInit() {
  }

}
