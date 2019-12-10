import { Component, OnInit ,Injectable } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from "../../animations/animations"
import { TransitionsService } from "../../services/native/transitions.service"
import { ActionClass } from "../../gallery-action-sheet/actionsheet"
import { AuthService } from '../../services/auth/auth.service'
import { FooterComponent } from "../../footer/footer.component"
import { GuestAddService } from "../../services/guest-add/guest-add.service"
import { AnnouncementSaveService  } from "../../services/announcements/announcement-save.service"
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
  private userDetail : any  
  private userColor : string
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
      title: 'What To Do',
      url: '/home-tab',
      icon: 'walk'
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
    private tranServe :TransitionsService,
    private footer : FooterComponent,
    private guestService : GuestAddService, 
    private annServe  :AnnouncementSaveService,
  ) {     
  
  }
  ionViewDidEnter(){       
   
  }
  ngOnInit() {    
    this.currentUser = `${this.authServ.userGuestDetails["first_name"]} ${this.authServ.userGuestDetails["last_name"]}`  
    this.isAdmin = this.authServ.isAdmin()    
    this.userColor = this.authServ.userGuestDetails["color"]
  }
  gotoRsvpList(){
    this.closeModal()
    this.tranServe.reRoute("/rsvp-list")
  }
  changeDecision(){
    
    let decision =this.authServ.userGuestDetails.will_come?"Decline":"Accept"

    this.actionSheet.confirmationMessage(`You Are changing your Response to ${decision}`).then((res)=>{
      if(res){     
        var rsvp = !this.authServ.userGuestDetails.will_come           
        this.updateStatus(rsvp)
      }
    })

  }
  async closeModal() {  
    
    await this.modalctrl.dismiss();
  }
  async logout() {
    this.actionSheet.confirmationMessage("Your About to Log-Out").then(res=>{
      if(!res){
        return null
      }
      console.log(this.authServ.userChatSubs)
      this.footer.clearBadge()
      this.footer.unsubscribeAllChat()    
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

  updateStatus(value){
    var message = "you are declining the invitation"
    if(value){
      message = "you are accepting the invitation"
    }
    this.actionSheet.confirmationMessage(message).then(data=>{
      if(data){
        this.guestService.updateStatus(this.authServ.userGuestDetails,value).then(data=>{                       
          if(value){
            this.actionSheet.customAlert("Hello!","Thanks for Accepting the invitation")
          }else{
            this.actionSheet.customAlert("Ow..","Hope You Change your Mind!")
          }                   
          this.tranServe.reRoute("/")
        })
      }
    })

  }

  
}
