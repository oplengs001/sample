import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent   {
  constructor(private router: Router ) {
    
   }


  goToNotifications() {
    this.router.navigateByUrl('/announcements');
  }
  goToMessages() {
    this.router.navigateByUrl('/messages');
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }
}
