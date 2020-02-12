import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { SharedComponent } from 'src/app/shared-component/shared';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-wedding-weather',
  templateUrl: './wedding-weather.page.html',
  styleUrls: ['./wedding-weather.page.scss'],
})
export class WeddingWeatherPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ioncontent:IonContent
  constructor(
    private homeMenu: HomeMenuPage,
    private sharedComps : SharedComponent,
    private annServe: AnnouncementSaveService
    ) { }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.ioncontent.scrollToTop(0)
  }
}
