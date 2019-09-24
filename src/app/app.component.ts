import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service'
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
  appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }, 
    {
      title: 'Wedding Program',
      url: '/ceremony',
      icon: 'easel'
    },    
    {
      title: 'Itenerary',
      url: '/itenerary',
      icon: 'paper'
    },
    {
      title: 'Reception',
      url: '/reception',
      icon: 'wine'
    },   
    {
      title: 'Announcements',
      url: '/announcements',
      icon: 'megaphone'
    },
    {
      title: 'Messages',
      url: '/message-list',
      icon: 'megaphone'
    },
  ]; 

  constructor(
    public authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router
    
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
    var currentUser = this.authService.user
    currentUser.subscribe((user) => {
      if (user) {     
        this.authService.currentUserData().then(profile =>{
          if(profile.isAdmin){
            this.adminUser = true
            this.appPages.push({
              title: 'Guest List',
              url: '/guestlist',
              icon: 'contacts'
            },
            {
              title: 'Group Chat',
              url: '/admin-messaging',
              icon: 'megaphone'
            },
            {
              title: 'Admin-Announcements',
              url: '/admin-announcement',
              icon: 'megaphone'
            },
            {
              title: 'Guest Add',
              url: '/guestadd',
              icon: 'megaphone'
            },)
          }
        })  
      }
      else {
        this.adminUser = false
      }
   });
  }
  ngOnInit(){
    this.isAdmin()
   
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
