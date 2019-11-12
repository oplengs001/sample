import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service'
import { TransitionsService } from './services/native/transitions.service';
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
  constructor(
    public authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private transServe : TransitionsService,
    
  ) {
    this.initializeApp();
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
  initializeApp() {       
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });    
  }
}
