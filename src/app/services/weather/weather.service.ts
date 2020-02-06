import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private headers = new HttpHeaders().append("Accept", "application/json" )
  private hour_limit = 9;
  
  private config ={
    weather_url : "https://api.weatherunlocked.com/api/resortforecast",  
    app_id : "1da5d76c",
    app_key : "517f65cb2270dd87f82bc1059680ec6e",
    app_id2 : "dfbbd7b2",
    app_key2 : "acd9f9997c49af151e9727de8018d236",
    qtown_api_endpoint : "https://api.openweathermap.org/data/2.5/weather?id=963516&APPID=aa0f9dce6dbbe256382c80a9121d8539",
    nzd_currency_endpoint :"https://free.currconv.com/api/v7/convert?q=NZD_PHP,NZD_USD,NZD_AUD,NZD_SGD,PHP_NZD,USD_NZD,AUD_NZD,SGD_NZD&compact=ultra&apiKey=969ac8deaf5fc94982a9"
  }


  constructor(
    public http: HttpClient
  ) { 
  }
  weatherIcon(icon){
    return `http://openweathermap.org/img/w/${icon}.png`
  }
  getWeather(resort_key : string) {   
    
    var config_url
    if( resort_key === "615013"){
      config_url  =`${this.config.weather_url}/${resort_key}?app_id=${this.config.app_id2}&app_key=${this.config.app_key2}`    
    }else{
      config_url  =`${this.config.weather_url}/${resort_key}?app_id=${this.config.app_id}&app_key=${this.config.app_key}`    
    }
     return this.http.get(
      config_url, { headers:this.headers}).toPromise()
      .then(data => 
      {return  this.ProcessWeather(data["forecast"])}
      ,error => {return error});
  }
  getQtown(){
    return this.http.get(
      this.config.qtown_api_endpoint).toPromise()
      .then(data => 
      {          
        console.log(data)   
        return  {
          weather : this.weatherIcon(data["weather"][0].icon),
          temperature : Math.round(data["main"]["feels_like"] - 273.15)
        }
        
      }
      ,error => {return error});
  } 
  getNZcurrencies(){
    return this.http.get(
      this.config.nzd_currency_endpoint).toPromise()
      .then(data => 
      {          
        console.log(data)   
        return data
        
      }
      ,error => {return error});
 
  }
  async ProcessWeather(forecast: any){     
    var filtered = await this.getDailyData(forecast)
      return {
        today: forecast[0],
        hourly : forecast.slice(0,9),
        daily : filtered,
      }
  }      
  getDailyData(forecast){
    return new Promise<any>((resolve, reject) => {
      var keys = ['date']
      var filtered =  forecast.filter(
          (s => o => 
              (k => !s.has(k) && s.add(k))
              (keys.map(k => o[k]).join('|'))
          )
          (new Set)
      );  
      resolve(filtered)
    })
  }

}