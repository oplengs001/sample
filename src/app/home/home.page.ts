import { Component , OnInit} from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { HomeMenuPage } from '../modals/menu/home-menu.page'
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toaster/toast-service';
import { TransitionsService } from '../services/native/transitions.service';
import { ModalController  } from '@ionic/angular';
import { Animation } from '@ionic/core';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pushes: any = [];
  constructor(
    private fcm: FCM, 
    public plt: Platform,
    private toastService: ToastService,
    private authServ : AuthService,
    private router: Router,
    private transition : TransitionsService,
    public modalctrl: ModalController,
    ) {
    this.plt.ready()
      .then(() => {
        this.fcm.onNotification().subscribe(data => {
          console.log(data)
          if (data.wasTapped) {
            this.toastService.showToast("New Notification!")
            console.log("Received in background");
          } else {         
            this.toastService.showNotif("");
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
    this.SubrcibeToOwnTopics()
  
  }
  SubrcibeToOwnTopics():void {
    this.authServ.currentUserData().then((data)=>{   
      console.log(data)
      let {chat_id} = data
      for(var i in chat_id ){
        console.log(chat_id[i])      
        this.fcm.subscribeToTopic(chat_id[i]);  
      }
    })
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
          enterAnimation: this.myEnterAnimation,
          leaveAnimation: this.myLeaveAnimation
    });          
    await modal.present();
  }
  myEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateX', '-100%', '-20%');

    backdropAnimation.fromTo('opacity', 0.01, 0.4);

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));

  }
  myLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    const wrapperElRect = wrapperEl!.getBoundingClientRect();

    wrapperAnimation.beforeStyles({ 'opacity': 1 })
                    .fromTo('translateX', '-20%', '-100%');
                    // .fromTo('translateX', '-100%', `${window.innerHeight - wrapperElRect.left}px`);
                    

    backdropAnimation.fromTo('opacity', 0.4, 0.0);

    return Promise.resolve(baseAnimation
      .addElement(baseEl)
      .easing('ease-out')
      .duration(400)
      .add(backdropAnimation)
      .add(wrapperAnimation));
}
  ngOnInit() {

    this.subscribeToTopic()
    
  }
}
