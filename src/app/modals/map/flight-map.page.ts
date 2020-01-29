import { Component, OnInit ,Injectable} from '@angular/core';
import { ModalController, } from '@ionic/angular';
@Component({
  selector: 'app-flight-map',
  templateUrl: './flight-map.page.html',
  styleUrls: ['./flight-map.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class FlightMapPage implements OnInit {
  content: any
  selection : boolean;
  continent : boolean;
  current_location : string;
  flight_time: string;
  details : string
  constructor(    private modalctrl: ModalController,) { 
    
    this.content=
  [
    {
      continent : "Europe",
      flight_time : "From 26 hours Route with stopover",
      details : "Fly from various European ports to Auckland or Christchurch via North America or Asia and connect to a domestic flight to Queenstown."
    },
    {
      continent : "Africa",
      flight_time : "Flight time: From 21 hours with stopover",
      details : "Fly from Johannesburg to Auckland via Sydney or Perth. Alternatively, fly from various African cities to Dubai, connect to Auckland or Christchurch. Then, connect to a domestic flight to Queenstown."
    },
    {
      continent : "Asia",
      flight_time : "Flight time: From 12 to 14 hours with stopover",
      details : "Fly from Asia’s main cities via Auckland, Christchurch or Australia’s east coast then connect directly to Queenstown."
    },
    {
      continent : "North America",
      flight_time : "Flight time: 14 to 16 hours with stopover",
      details : "Fly from Los Angeles, San Francisco, Houston or Vancouver to Auckland and connect to Queenstown."
    },
    {
      continent : "South America",
      flight_time : "Flight time: From 14 hours with stopover",
      details : "Fly from Buenos Aires or Santiago to Auckland and connect to Queenstown."
    },
    {
      continent : "Australia",
      flight_time : "Flight time: 2 to 3 hours",
      details : "Fly from Sydney, Melbourne, Brisbane or the Gold Coast directly to Queenstown International Airport."
    },
    {
      continent : "Australia",
      flight_time : "Flight time: 2 to 3 hours",
      details : "Fly from Sydney, Melbourne, Brisbane or the Gold Coast directly to Queenstown International Airport."
    },
  ]
  }

  ngOnInit() {
    this.continent = true
  }
  async closeModal() {  
    await this.modalctrl.dismiss();
  }
  async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalctrl.create({
          component: FlightMapPage,     
    });          
    await modal.present();
  }
  changeLocation(location:number){ 
    this.current_location = this.content[location].continent
    this.flight_time = this.content[location].flight_time
    this.details = this.content[location].details
    this.continent = false
    this.selection = true
  }
}
