import { Component, OnInit ,Injectable } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from "../../animations/animations"
import { TransitionsService } from "../../services/native/transitions.service"
import { ActionClass } from "../../gallery-action-sheet/actionsheet"
import { AuthService } from '../../services/auth/auth.service'
import { FooterComponent } from "../../footer/footer.component"
import { GuestAddService } from "../../services/guest-add/guest-add.service"
import { AnnouncementSaveService  } from "../../services/announcements/announcement-save.service"
import { Network } from '@ionic-native/network/ngx';
import { ThrowStmt } from '@angular/compiler';
import { DietRestPage } from "../../modals/diet-rest/diet-rest.page"
import { BusReservationsPage } from "../../modals/bus-reservations/bus-reservations.page"
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
  private currentUID : string
  private userColor : string
  private diet_details : any
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
      title: 'Rentals & Transportation',
      url: '/rentals',
      icon: 'pricetag'
    },   
    {
      title: 'What to Wear',
      url: '/wedding-weather',
      icon: 'rainy'
    },
    {
      title: 'Accommodation',
      url: '/accomodations',
      icon: 'bed'
    },
    {
      title: 'Food & Drinks',
      url: 'dining',
      icon: 'restaurant'
    },
    {
      title: 'Activities',
      url: '/home-tab',
      icon: 'walk'
    },
    {
      title: 'Announcements',
      url: 'notifs',
      icon: 'notifications'
    },
    {
      title: 'Photos',
      url: 'photos',
      icon: 'images'
    },
    {
      title: 'Itinerary',
      url: 'itinerary',
      icon: 'list-box'
    },
    {
      title: 'Messages',
      url: 'messages',
      icon: 'chatboxes'
    },
    {
      title: 'Wedding Gift',
      url: 'charity',
      icon: 'gift'
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

    this.isAdmin = this.authServ.isAdmin()    
    
    this.userColor = this.authServ.userGuestDetails["color"]
    this.currentUID = this.authServ.userGuestDetails["uid"]  
  }
  ionViewDidLeave(){

  }
  gotoRsvpList(){
    this.closeModal()
    this.tranServe.reRoute("/rsvp-list")
  }
  gotoDining(){
    this.tranServe.reRouteActivity("Dining")
  }
  changeDecision(){
    
    let decision =this.authServ.userGuestDetails.will_come?"Decline":"Accept"

    this.actionSheet.confirmationMessage(`You are changing your response to ${decision}`).then((res)=>{
      if(res){     
        var rsvp = !this.authServ.userGuestDetails.will_come           
        this.updateStatus(rsvp,false)
      }
    })

  }
  async openBusReservations(){
    const modal: HTMLIonModalElement =
    await this.modalctrl.create({
       component: BusReservationsPage,         
    });          
    await modal.present();
  }
  async openDietRestrictions(){      
    const modal :HTMLIonModalElement =
    await this.modalctrl.create({
      component: DietRestPage,     
      componentProps: {
        guests :  this.diet_details
      }    
    }); 
    await modal.present();

  }
  async closeModal(url?:string) {  
    if(url==="dining"){
      this.gotoDining()
    }else if (url === "notifs"){
      this.tranServe.reRouteNoAnimation("announcements")
    }else if (url === "itinerary"){
      this.tranServe.reRouteActivityNoAnimation("Itinerary")
    }else if (url === "photos"){
      this.tranServe.reRouteNoAnimation("gallery")
    }else if (url === "messages"){
      this.tranServe.reRouteNoAnimation("message-list")
    }
    await this.modalctrl.dismiss();
  }
  async logout() {
    this.actionSheet.confirmationMessage("Your about to log-out").then(res=>{
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

  updateStatus(value,first_log?:boolean){
    var message = "You are declining the invitation"
    if(value){
      message = "You are accepting the invitation"
    }
    this.actionSheet.confirmationMessage(message).then(data=>{
      if(data){
        this.guestService.updateStatus(this.authServ.userGuestDetails,value).then(data=>{                       
          if(value){
            this.actionSheet.customAlert("Welcome!","Thanks for accepting the invitation.")            
            // this.plusOnePrompt()
            // if(first_log){
            //   setTimeout(()=>{
            //     this.actionSheet.customAlert("",`reset password request was sent to your email ("${this.authServ.userGuestDetails["email"]})"`)     
            //   },2000)
              
            // }
          }else{
            this.actionSheet.customAlert("Ow.. Boo!","Hope you change your mind.")
            // if(first_log){
            //   setTimeout(()=>{
            //     this.actionSheet.customAlert("",`reset password request was sent to your email ("${this.authServ.userGuestDetails["email"]})"`)     
            //   },2000)
              
            // }
          }
       
          this.tranServe.reRoute("/")
        })
      }
    })

  }

  plusOnePrompt(message?: string){
    var r_message = message||"Do you have extra Guests attending with you?"
    this.actionSheet.confirmationMessage(r_message,"","Hey There!").then(data=>{
      if(data){
      this.actionSheet.plusOnePrompt().then(data=>{
        var {extra} = data.values
     
        if (extra !== "0" && extra !== "") {
          if(this.currentUID === undefined){
            this.currentUID = this.authServ.currentUserId()
          }
          extra = parseInt(extra)
          this.guestService.updateGuestCount(this.currentUID,extra)
        }else{
          return null
        }
      })
      }else{
      }
    })  
  }
  changePassword(){
    this.actionSheet.confirmationMessage("Password reset request will be sent or your email.","").then(data=>{
      if(data){
        this.authServ.resetPassword( this.authServ.userGuestDetails["email"]).then(
          data=>{
            this.actionSheet.customAlert("Success!",`Check your email "${this.authServ.userGuestDetails["email"]}" to reset your password!`)
          }
        )
      }
    })
  }
}

