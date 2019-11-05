import { Component, OnInit } from '@angular/core';
import { GuestAddService, Guest } from "../services/guest-add/guest-add.service"
import { Observable } from 'rxjs';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-guestlist',
  templateUrl: './guestlist.page.html',
  styleUrls: ['./guestlist.page.scss'],
})
export class GuestlistPage implements OnInit {
  private guests: Observable<Guest[]>;
 
  constructor(
    private guestServ: GuestAddService ,
    private router : Router) { }
 
  ngOnInit() {
    this.guests = this.guestServ.getGuests();
  }
  reRoute(page:string){
    console.log(page)
    this.router.navigateByUrl(page);
  }
}
