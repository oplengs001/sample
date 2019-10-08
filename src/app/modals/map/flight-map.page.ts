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

  constructor(    private modalctrl: ModalController,) { }

  ngOnInit() {
    
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
}
