import { Component, OnInit,ViewChild } from '@angular/core';
import { HomeMenuPage } from 'src/app/modals/menu/home-menu.page';
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { GeneralInfoService } from 'src/app/services/content/general-info.service';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { ModalController, IonContent } from '@ionic/angular';
@Component({
  selector: 'app-queenstown',
  templateUrl: './queenstown.page.html',
  styleUrls: ['./queenstown.page.scss'],
})
export class QueenstownPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ioncontent: IonContent;
  currency:any
  hidder : boolean
  constructor(
    private homeMenu: HomeMenuPage,
    private annServe: AnnouncementSaveService,
    private gInfo : GeneralInfoService,
    private weather : WeatherService
    
  ) { 
    this.hidder=true
  }

  ngOnInit() {
    
    this.reFormatCurrency()
    
  }
  ionViewDidEnter(){
    this.ioncontent.scrollToTop(0)
  }
  changeFormat(){
    this.hidder = !this.hidder
  }
 async reFormatCurrency(){
  await this.weather.getNZcurrencies().then(rec=>{
    this.currency ={
      AUD_NZD : rec["AUD_NZD"].toFixed(3),
      PHP_NZD : rec["PHP_NZD"].toFixed(3),
      SGD_NZD : rec["SGD_NZD"].toFixed(3),
      USD_NZD : rec["USD_NZD"].toFixed(3),
      NZD_AUD : rec["NZD_AUD"].toFixed(3),
      NZD_PHP : rec["NZD_PHP"].toFixed(3),
      NZD_SGD : rec["NZD_SGD"].toFixed(3),
      NZD_USD : rec["NZD_USD"].toFixed(3)
    }
    console.log(this.currency)
  })
 
  }

}
