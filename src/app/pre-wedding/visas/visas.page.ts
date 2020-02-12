import { Component, OnInit,ViewChild } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { GeneralInfoService } from 'src/app/services/content/general-info.service';
import { ModalController, IonContent } from '@ionic/angular';
@Component({
  selector: 'app-visas',
  templateUrl: './visas.page.html',
  styleUrls: ['./visas.page.scss'],
})
export class VisasPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ioncontent: IonContent;
  constructor(
    private homeMenu: HomeMenuPage,
    private annServe: AnnouncementSaveService,
    private gInfo : GeneralInfoService
  ) { }

  ngOnInit() {
   
  }
  ionViewDidEnter(){
    this.ioncontent.scrollToTop(0)
  }
  openLink(url){
    // window.open(url, '_system');
  }
}
