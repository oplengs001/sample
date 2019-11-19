import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service'
import { TransitionsService } from './services/native/transitions.service';
import { Network } from '@ionic-native/network/ngx';
import { IonSlides } from '@ionic/angular';
import {  Router } from '@angular/router';
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
  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };
  constructor(
    public authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private transServe : TransitionsService,
    private network: Network
    
  ) {
    this.initializeApp();
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      alert('No Internet Connection Detected, Please connect to the Internet to use the app Properly');
    });  
    this.hideLogin = true
    this.hideSlide = false
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
  }
  
  login() {
    this.authService.login(this.email, this.password)    
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
      this.authService.currentUserData().then(data=>
        this.adminUser = data.isAdmin
      )
    })
  }
  goToItenerary(){
    this.transServe.reRouteActivityNoAnimation("Itenerary")
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
