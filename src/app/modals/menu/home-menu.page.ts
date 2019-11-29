import { Component, OnInit ,Injectable } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from "../../animations/animations"
import { TransitionsService } from "../../services/native/transitions.service"
import { ActionClass } from "../../gallery-action-sheet/actionsheet"
import { AuthService } from '../../services/auth/auth.service'
import { FooterComponent } from "../../footer/footer.component"
import { RsvpPage } from "../../rsvp/rsvp.page"
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
  private isAdmin: boolean
  private will_come: boolean
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
    private authServ : AuthService,
    private transitions :TransitionsService,
    private rsvp : RsvpPage,
    private footerComp : FooterComponent
  ) {     
    this.currentUser = `${this.authServ.userGuestDetails["first_name"]} ${this.authServ.userGuestDetails["last_name"]}`  
    this.isAdmin = this.authServ.isAdmin()
    this.will_come = this.authServ.userGuestDetails["will_come"]
  }
  ionViewDidEnter(){
  }
  ngOnInit() {
  }
  gotoRsvpList(){
    this.closeModal()
    this.transitions.reRoute("/rsvp-list")
  }
  changeDecision(){
    
    let decision =this.will_come?"Decline":"Accept"

    this.actionSheet.confirmationMessage(`You Are changing your decision to ${decision}`).then((res)=>{
      if(res){     
        var rsvp = !this.will_come            
        this.rsvp.updateStatus(rsvp).then(data=>{
          this.will_come = rsvp
        })
      }
    })

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
