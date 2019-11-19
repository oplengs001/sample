import { Component, OnInit ,Injectable } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from "../../animations/animations"
import { ActionClass } from "../../gallery-action-sheet/actionsheet"
import { AuthService } from '../../services/auth/auth.service'
@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.page.html',
  styleUrls: ['./home-menu.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class HomeMenuPage implements OnInit {
  private currentUser : string
  appPages = [
    {
      title: 'VISAS',
      url: '/visas',
      icon: 'card'
    }, 
    {
      title: 'Getting There',
      url: '/getting-there',
      icon: 'airplane'
    },    
    {
      title: 'Accommodation',
      url: '/accomodations',
      icon: 'bed'
    },
    {
      title: 'Rentals',
      url: '/rentals',
      icon: 'pricetag'
    },   
    {
      title: 'Wedding Weather',
      url: '/wedding-weather',
      icon: 'rainy'
    }  
  ]; 

  constructor(
    private actionSheet : ActionClass,
    private modalctrl: ModalController,
    private authServ : AuthService
  ) {     
    this.currentUser = `${this.authServ.userGuestDetails["first_name"]} ${this.authServ.userGuestDetails["last_name"]}`
  }

  ngOnInit() {
  }
  async closeModal() {  
    matchMedia
    await this.modalctrl.dismiss();
  }
  async logout() {  
    this.actionSheet.confirmationMessage("Your About to Log-Out").then(res=>{
      if(!res){
        return null
      }   
      this.authServ.logout()
    })

  }
  async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalctrl.create({
          component: HomeMenuPage,     
          enterAnimation: myEnterAnimation,
          leaveAnimation: myLeaveAnimation
    });          
    await modal.present();
  }



  
}
