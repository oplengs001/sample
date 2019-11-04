import { Component , OnInit,Injectable} from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { HomeMenuPage } from '../modals/menu/home-menu.page'
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toaster/toast-service';
import { TransitionsService } from '../services/native/transitions.service';
import { ModalController  } from '@ionic/angular';
import {  Router } from '@angular/router';
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
  public inbox_count : number
  constructor(
    private fcm: FCM, 
    public plt: Platform,
    private toastService: ToastService,
    private authServ : AuthService,
    private router: Router,
    private transition : TransitionsService,
    public modalctrl: ModalController,
    private footerFunc : FooterComponent,
    // private badge: Badge
    ) {
      
    this.plt.ready()
      .then(() => {
        this.fcm.onNotification().subscribe( async data => {
          console.log(data)
          // this.badge.increase(1);
          this.footerFunc.addBadge()
          if (data.wasTapped) {
        
          } else {
            if(data.type === "chat"){
              var uid = await this.authServ.currentUserId();        
              if (data.sender_id === uid){
                
              }else{
                this.footerFunc.SubrcibeToOwnTopics()
                this.toastService.showNotif("New Message From!", data);
              }       
            }else if(data.type === "announcement"){
              this.toastService.showNotif("New Announcement!",data)
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
}
