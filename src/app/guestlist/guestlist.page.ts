import { Component, OnInit } from '@angular/core';
import { GuestAddService, Guest } from "../services/guest-add/guest-add.service"
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-guestlist',
  templateUrl: './guestlist.page.html',
  styleUrls: ['./guestlist.page.scss'],
})
export class GuestlistPage implements OnInit {
  private guests: Observable<Guest[]>;
 
  constructor(private guestServ: GuestAddService) { }
 
  ngOnInit() {
    this.guests = this.guestServ.getGuests();
  }

}
