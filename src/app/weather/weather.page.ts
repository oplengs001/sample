import { Component, OnInit ,AfterViewInit } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
import { WeatherService}  from "../services/weather/weather.service"
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
  cpeak_data : any
  cpeak_today: any
  cpeak_hourly : any
  cpeak_daily : any
  cpeak_slide : boolean; 
  rmark_data : any
  rmark_today: any
  rmark_hourly : any
  rmark_daily : any
  rmark_slide : boolean; 
  loaderToShow: any;
  constructor(
    private transServe: TransitionsService,
    private weatherServ : WeatherService,
    private loadingController: LoadingController
  ) { 
    this.cpeak_slide  = true
  }
  async ngOnInit() {
    // this.showLoader()
    this.cpeak_data = await this.weatherServ.getWeather("4424660").then(data=>{
      // this.hideLoader();
      console.log(data)
      this.cpeak_slide  = false
      this.cpeak_today = data.today
      this.cpeak_hourly = data.hourly
      this.cpeak_daily = data.daily
    })
    this.rmark_data = await this.weatherServ.getWeather("615013").then(data=>{
      // this.hideLoader();
      console.log(data)
      this.rmark_slide  = false
      this.rmark_today = data.today
      this.rmark_hourly = data.hourly
      this.rmark_daily = data.daily
    })


  } 
  extensionChange(item:string){
    return item.slice(0, -4);
  }
  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Loading Weather Data'
    }).then((res) => {
      res.present();      
    });
 
  }
  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 4000);
  }
  converTime (time) {
    return moment(time,"HH:mm").format("hh:mm a")
  }
  convertDate(time){
    return moment(time, "DD/MM/YYYY").lang("en").format("ddd, DD, MMM")
  }
}
