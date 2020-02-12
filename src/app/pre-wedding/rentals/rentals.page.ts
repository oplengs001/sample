import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { GeneralInfoService } from 'src/app/services/content/general-info.service';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.page.html',
  styleUrls: ['./rentals.page.scss'],
})
export class RentalsPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ioncontent:IonContent
  constructor(
    private homeMenu: HomeMenuPage,
    private annServe: AnnouncementSaveService,
    private gInfo : GeneralInfoService) { }
  
  ngOnInit() {
  }
  openLink(url){
    // window.open(url, '_system');
  }
  ionViewDidEnter(){
    this.ioncontent.scrollToTop(0)
  }
}
