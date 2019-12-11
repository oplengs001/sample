import { Component ,ViewChild, OnInit,Injectable} from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import {IonContent, Platform } from '@ionic/angular';
import { HomeMenuPage } from '../modals/menu/home-menu.page'
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toaster/toast-service';
import { GuestAddService } from '../services/guest-add/guest-add.service';
import { TransitionsService } from '../services/native/transitions.service';
import { ModalController,NavController  } from '@ionic/angular';
import {  Router ,NavigationExtras} from '@angular/router';
import { myEnterAnimation, myLeaveAnimation} from '../animations/animations'
import { FooterComponent} from '../footer/footer.component'
// import { Badge } from '@ionic-native/badge/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pushes: any = [];
  @ViewChild(IonContent, {static: false}) content: IonContent;
  public inbox_count : number
  public forRsvp : boolean
  private scrollDepthTriggered = false;
  
  constructor(
    private fcm: FCM, 
    public plt: Platform,
    private toastService: ToastService,
    private authServ : AuthService,
    private router: Router,
    private transition : TransitionsService,
    public modalctrl: ModalController,
    private navCtrl : NavController,
    private footerFunc : FooterComponent,
    private guestFunc : GuestAddService, 
    // private badge: Badge
    ) {
    this.forRsvp = this.footerFunc.forRsvp 
    this.plt.ready()
      .then(() => { 
               
        this.fcm.onNotification().subscribe( async data => {
          console.log(data)
          // this.badge.increase(1);
          
          if (data.wasTapped) {
            if(data.type ==="chat"){
              let navigationExtras: NavigationExtras = {
                queryParams: {
                    group_id: data.group,
                }
              };
              this.navCtrl.navigateForward(['messages'], navigationExtras);
              this.footerFunc.addBadge()
            }else if(data.type === "announcement"){
              this.footerFunc.addBadge()
              this.transition.reRoute("announcements")
              this.guestFunc.updateNotifCount(uid,"increment")
            }
          } else {
            if(data.type === "chat"){
              // var uid = await this.authServ.currentUserId();        
              // if (data.sender_id === uid){
                
              // }else{
              //   this.footerFunc.SubrcibeToOwnTopics()
              //   this.toastService.showNotif("New Message From!", data);
              // }       
              this.footerFunc.addBadge()
            }else if(data.type === "announcement"){
              var uid = await this.authServ.currentUserId();   
              this.footerFunc.addBadge()
              this.toastService.showNotif("New Announcement!",data)
              this.guestFunc.updateNotifCount(uid,"increment")
            }else if(data.type === "adminNotif"){
              if(this.authServ.isAdmin){
                
                this.toastService.showNotif("New RSVP Response!",data.data_body)
              }
              
            }
            console.log("Received in foreground");
          };
        });
      
        this.fcm.onTokenRefresh().subscribe(token => {
          // Register your new token in your back-end if you want
          // backend.registerToken(token);
          console.log(token) 
          console.log("fcm token for testing 1")
        });
      }).catch(error =>{
        console.log(error)
      })
  }
  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');    
  }
  getToken() {
    this.fcm.getToken().then(token => {
      console.log(token) 
      console.log("fcm token for testing 2")
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }
 
  unsubscribeFromTopic() {
    
    this.fcm.unsubscribeFromTopic('enappd');
  }
  reRoute(page:string){    
    this.transition.reRoute(page)
    // this.router.navigateByUrl(page);
  }
  reRouteActivity (activity:string){
    this.transition.reRouteActivity(activity)
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
  ngOnInit() {
    this.subscribeToTopic()
    
  }
  scrollToBottom(){
    this.content.scrollToBottom(500);
  }
  async logScrolling($event) {
    // only send the event once
    if(this.scrollDepthTriggered) {
      return;
    }

    console.log(this.scrollDepthTriggered);
    const scrollElement = await $event.target.getScrollElement();
    // minus clientHeight because trigger is scrollTop
    // otherwise you hit the bottom of the page before 
    // the top screen can get to 80% total document height
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    const currentScrollDepth = $event.detail.scrollTop;
    const targetPercent = 80;
    let triggerDepth = ((scrollHeight / 100) * targetPercent); 
    if(currentScrollDepth > triggerDepth) {
      console.log(`Scrolled to ${targetPercent}%`);
      // this ensures that the event only triggers once
      this.scrollDepthTriggered = true;
      // do your analytics tracking here
    }else{
      this.scrollDepthTriggered = false;
    }
  }
}
