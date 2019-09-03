import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  email: string;
  password: string;

  public appPages = [
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
      title: 'Locator',
      url: '/locator',
      icon: 'walk'
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
    this.authService.login(this.email, this.password);
    this.email = this.password = '';    
  }

  logout() {
    this.authService.logout();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });    
  }
}
