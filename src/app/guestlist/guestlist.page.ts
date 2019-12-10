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
  private footer_details : any
  constructor(
    private guestServ: GuestAddService ,
    private router : Router) { }
 
  ngOnInit() {
    this.guests = this.guestServ.getGuests();
    this.guests.subscribe(data=>{
      this.guestSummary(data)
    })
  }
  guestSummary(guests) {
    var attending=0,n_attending=0,overall=0,all_guest=guests.length

    for(var i in guests){
      var data = guests[i]
      if(data.will_come){
        attending++
        }else{
        n_attending++
        }
      if(data.extra){
        overall = overall+ data.extra + 1
        }else{
        overall++
        }      
    }

    this.footer_details={
      attending,n_attending,overall,all_guest
    }    
  }
  reRoute(page:string){
    console.log(page)
    this.router.navigateByUrl(page);
  }
}
