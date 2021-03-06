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
import { WeatherService} from  '../services/weather/weather.service'
import { Network } from '@ionic-native/network/ngx';
import { AnnouncementSaveService } from '../services/announcements/announcement-save.service';
import { GeneralInfoService } from '../services/content/general-info.service';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
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
  private weather : any
  public connection_status : string
  private currentRoute : string
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
    private weatherServ : WeatherService,
    private network: Network,
    private annServe  :AnnouncementSaveService,   
  
    // private badge: Badge
    ) {
    this.forRsvp = this.footerFunc.forRsvp 
    this.plt.ready()
      .then(() => {    
        console.log(this.network.type )
        if(this.network.type !== "none"){
          this.connection_status = "connected"
        }else{
          this.toastService.showStayingToast("Network Disconnected") 
        }
      
        let connectSubscription = this.network.onConnect().subscribe(() => {
          
          if(this.connection_status !== "connected"){
         
            this.toastService.showToast("Network Detected")
            this.connection_status = "connected"
            setTimeout(() => {
              if (this.network.type === 'wifi') {
                this.toastService.tryDismissAll()
                this.toastService.showToast("Connected")
              }
            }, 3000);
          }
        });
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {    
          if(this.connection_status === "connected"){
            this.connection_status = "disconneted"
            this.toastService.tryDismissAll()
            this.toastService.showStayingToast("Network Disconnected")        
          }
        });
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
              // this.transition.reRoute("home")
              this.navCtrl.navigateForward(['messages'], navigationExtras);
              this.footerFunc.addBadge()
            }else if(data.type === "announcement"){
              this.footerFunc.addBadge()
              this.transition.reRoute("announcements")
              this.guestFunc.updateNotifCount(uid,"increment")
            }

            else if(data.type === "enappd"){
              this.footerFunc.addBadge()
              var navigationExtras: NavigationExtras = {
                queryParams: {
                    group_id: data.group,
                }
              };
              this.transition.reRouteActivityNoAnimation("Itinerary")              
            }else if(data.type === "adminNotif"){
              this.transition.reRoute("/rsvp-list")
            }
          } else {
            if(data.type === "chat"){
              var uid = await this.authServ.currentUserId();        
              if (data.sender_id !== uid){
                // this.footerFunc.SubrcibeToOwnTopics()
        
                // this.localNotifications.schedule({
                //   title: data.title,
                //   text: data.content,
                //   foreground: true,
                // });
                this.toastService.messageNotif(`New message! (${data.title})`, data);
              }else{
              
              }
           
              if(!this.authServ.isAdmin){
                this.footerFunc.addBadge()
              }
            
            }else if(data.type === "announcement"){
              var uid = await this.authServ.currentUserId();   
              this.footerFunc.addBadge()
              // this.toastService.showNotif("New Announcement!",data)
              this.guestFunc.updateNotifCount(uid,"increment")
              this.toastService.showNotif(`New announcement!`, data);
              // this.localNotifications.schedule({
              //   title: "New Announcement!",
              //   text: data.data_body,
              //   foreground: true
              // });
            }else if(data.type === "adminNotif"){
              if(this.authServ.isAdmin){
                // this.localNotifications.schedule({
                //   title: "Admin Notification",
                //   text: data.data_body,
                //   foreground: true
                // });
                this.toastService.adminToast("New admin notification!",data.data_body)
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
    this.weatherServ.getQtown().then(data=>{
      console.log(data)
      this.weather = data
      this.weather.weather = data.weather || "../assets/icon/set/PartlyCloudyDay.png"
      this.weather.temperature = data.temperature || "7"
      console.log(this.weather)       
    })     
  
  }
  scrollToBottom(){
    this.content.scrollToBottom(500);
  }
  scrollToTop(){
    this.content.scrollToTop(500);
  }
  async logScrolling($event) {
    // only send the event once
  
    
    console.log(this.scrollDepthTriggered);
    const scrollElement = await $event.target.getScrollElement();
    // minus clientHeight because trigger is scrollTop
    // otherwise you hit the bottom of the page before 
    // the top screen can get to 80% total document height
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    const currentScrollDepth = $event.detail.scrollTop;
    const targetPercent = 65;
    let triggerDepth = ((scrollHeight / 100) * targetPercent); 
    if(currentScrollDepth > triggerDepth) {
      // this ensures that the event only triggers once
      // this.scrollDepthTriggered = true;
      this.scrollDepthTriggered = true;
      // do your analytics tracking here
    }else{
      this.scrollDepthTriggered = false;
    }
  }
}
