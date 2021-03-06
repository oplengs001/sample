import { Component, OnInit ,AfterViewInit } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
import { WeatherService}  from "../services/weather/weather.service"
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { min } from 'rxjs/operators';
import { ToastService } from '../services/toaster/toast-service';

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
  cardrona_data : any
  cardrona_today: any
  cardrona_hourly : any
  cardrona_daily : any
  cardrona_slide : boolean; 
  treble_data : any
  treble_today: any
  treble_hourly : any
  treble_daily : any
  treble_slide : boolean; 
  loaderToShow: any;
  constructor(
    private transServe: TransitionsService,
    private weatherServ : WeatherService,
    private loadingController: LoadingController,
    private toaster : ToastService
  ) { 
    this.cpeak_slide  = true
  }
  async ngOnInit() {
    this.showLoader()
    this.cpeak_data = await this.weatherServ.getWeather("4424660").then(data=>{
      this.hideLoader();
      this.toaster.showToast("Coronet's Peak loaded")
      console.log(data)
      this.cpeak_slide  = false
      this.cpeak_today = data.today
      this.cpeak_hourly = data.hourly
      this.cpeak_daily = data.daily

    })
    this.rmark_data = await this.weatherServ.getWeather("615013").then(data=>{
      this.hideLoader();
      this.toaster.showToast("Remarkables loaded")
      this.rmark_slide  = false
      this.rmark_today = data.today
      this.rmark_hourly = data.hourly
      this.rmark_daily = data.daily
   
    })
    this.cardrona_data = await this.weatherServ.getWeather("411011").then(data=>{
      this.hideLoader();
      this.toaster.showToast("Cardrona Alpine loaded")
      this.cardrona_slide  = false
      this.cardrona_today = data.today
      this.cardrona_hourly = data.hourly
      this.cardrona_daily = data.daily
  
    })
    this.treble_data = await this.weatherServ.getWeather("4437443").then(data=>{
      this.hideLoader();
      this.toaster.showToast("Treble Cone loaded")
      this.treble_slide  = false
      this.treble_today = data.today
      this.treble_hourly = data.hourly
      this.treble_daily = data.daily

    })

  } 
  extensionChange(item:string){
    return item.slice(0, -4);
  }
  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: `Loading weather data`
    }).then((res) => {
      res.present();      
    });
 
  }
  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 5000);
  }
  converTime (time) {
    return moment(time,"HH:mm").format("hh:mm a")
  }
  convertDate(time){
    return moment(time, "DD/MM/YYYY").lang("en").format("ddd, DD, MMM")
  }
  checkTime(){
    // var currentTime = moment().lang("en").utcOffset("+12:00").format("a")    
    var currentTime = moment(),
    // sunrise = moment().utcOffset("+12:00").set({
    //     hour: 6,          
    //     minute:30         
    // }),
    // sunset  = moment().utcOffset("+12:00").set({
    //     hour: 18,    
    //     minute:30               
    // }),
    sunrise = moment().set({
      hour: 6,          
      minute:30         
    }),
    sunset  = moment().set({
        hour: 18,    
        minute:30               
    })
    if(currentTime.isBetween(sunrise,sunset)){
      
      return "morningUI"
    }else{

      return "eveningUI"
    }

  }
}
