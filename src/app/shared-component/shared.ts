import { Component, OnInit ,Injectable} from '@angular/core';
import { HomeMenuPage } from '../modals/menu/home-menu.page'
import { ModalController  } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation} from '../animations/animations'
@Injectable({
    providedIn: 'root'
})
export class SharedComponent   {
    constructor(    public modalctrl: ModalController){

    }
    async openMenu() {
        const modal: HTMLIonModalElement =
           await this.modalctrl.create({
              component: HomeMenuPage,     
              enterAnimation: myEnterAnimation,
              leaveAnimation: myLeaveAnimation
        });          
        await modal.present();
      }
}  