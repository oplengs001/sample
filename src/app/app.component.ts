import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service'
import { TransitionsService } from './services/native/transitions.service';
import { Network } from '@ionic-native/network/ngx';
import { IonSlides } from '@ionic/angular';
import {  Router } from '@angular/router';
import { ToastService} from "../app/services/toaster/toast-service"

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  email: string;
  password: string;
  adminUser : boolean;  
  hideLogin : boolean;  
  hideSlide : boolean;
  forRsvp : boolean;
  userID : string;
  userDetails : any
  image_class : string
  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };
  image_links : any
  constructor(
    public authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private transServe : TransitionsService,
    private network: Network,
    private toaster : ToastService
  ) {
    this.initializeApp();
 
    this.hideLogin = true
    this.hideSlide = false
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
  }
  openNetWorkSubscribers(){
    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.toaster.showToast("Network Detected")
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          this.toaster.showToast("Connected")
        }
      }, 3000);
    });
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.toaster.showToast("Network Disconnected")
    });
    // stop connect watch

    // disconnectSubscription.unsubscribe()
    // connectSubscription.unsubscribe();
  }
  login() {
    this.authService.login(this.email, this.password).then(data=>{
      this.authService.user.subscribe((data)=>{                    
        this.authService.currentUserData().then(data=>{
          this.adminUser = data.isAdmin        
          this.forRsvp = data.forRsvp
          this.userID = data.uid
          this.userDetails = data     
          // this.openNetWorkSubscribers()          
            if(this.forRsvp){
              this.authService.resetPassword(data.email)
              this.transServe.reRoute("rsvp")
            }
          }
        )
      })
    })
    this.email = this.password = '';    
  } 
  logout() {
    this.authService.logout();
  } 
  
  isAdmin(){  
    this.adminUser = this.authService.isAdmin()
  }
  ngOnInit(){
    this.authService.user.subscribe((data)=>{              
      this.authService.currentUserData().then(data=>{
          this.adminUser = data.isAdmin    
          this.forRsvp = data.forRsvp
          this.userID = data.uid   
          this.userDetails = data
          if(this.forRsvp){
            this.transServe.reRoute("rsvp")
          }
        }
      )
    })
    this.platform.ready().then(() => {
        if (this.platform.is('ipad')) {
          console.log("Hey iPad!");
          this.image_links ={
            s1: "../assets/images/login_icons/ipads1.png",
            s2: "../assets/images/login_icons/ipads2.png",
            s3: "../assets/images/login_icons/ipads3.png",
            s4: "../assets/images/login_icons/ipads4.png ",
            s5: "../assets/images/login_icons/ipads5.png "
          }
          this.image_class = "slide-icon tablet-view"
        }else{
          this.image_links ={
            s1: "../assets/images/login_icons/s1.png",
            s2: "../assets/images/login_icons/s2.png",
            s3: "../assets/images/login_icons/s3.png",
            s4: "../assets/images/login_icons/s4.png ",
            s5: "../assets/images/login_icons/s5.png "
          }
          this.image_class = "slide-icon"
        }
    });
  
  
  }
  goToItinerary(){
    this.transServe.reRouteActivityNoAnimation("Itinerary")
  }
  reRoute(page:string){
    console.log(page)
    this.router.navigateByUrl(page);
  }
  getStarted(){
    this.hideLogin = !this.hideLogin
    this.hideSlide = !this.hideSlide
  }
  initializeApp() {       
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });    
  }
}
