import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  email: string;
  password: string;
  appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }, 
    {
      title: 'Ceremony',
      url: '/ceremony',
      icon: 'easel'
    },
    {
      title: 'Guest List',
      url: '/guestlist',
      icon: 'contacts'
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
    }   
  ];

  constructor(
    public authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
    
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
        this.authService.currentUserData(user.uid).then(profile =>{
          if(profile.isAdmin){
            this.appPages.push(
              {
                title: 'Guest Locator',
                url: '/locator',
                icon: 'walk'
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
              }
            )
          }
        })  
      }
      else {
        console.log("no user")
      }
   });
  }
  ngOnInit(){
    this.isAdmin()
   
  }
  initializeApp() {   
    

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });    
  }
}
