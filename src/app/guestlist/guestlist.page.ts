import { Component, OnInit } from '@angular/core';
import { GuestAddService, Guest } from "../services/guest-add/guest-add.service"
import { Observable ,Subscription} from 'rxjs';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-guestlist',
  templateUrl: './guestlist.page.html',
  styleUrls: ['./guestlist.page.scss'],
})
export class GuestlistPage implements OnInit {
  private guests: Observable<Guest[]>;
  private footer_details : any
  private guest_array : any
  private sortValue :any
  private sortFlow : any
  private sorting : any
  private searchText : string
  private guestSubs : Subscription
  constructor(
    private guestServ: GuestAddService ,
    private router : Router) { }
    public items: any = [];
  ngOnInit() {
    // this.guestSubs = this.guestServ.getGuests().subscribe(data=>{
    //   this.guest_array = data      
    //   this.guestSummary(data)
    // })
    // this.sortValue = "first_name"
    // this.sortFlow = false
  }
  ionViewDidEnter() {
    this.guestSubs = this.guestServ.getGuests().subscribe(data=>{
      console.log(data)
      this.guest_array = data      
      this.guestSummary(data)
    })    

    this.sortValue = "first_name"
    this.sortFlow = false
  }
  ionViewDidLeave(){   
    // this.guestSubs.unsubscribe()
  }
  guestSummary(guests) {
    var attending=0,n_attending=0,all_guest=0,pendings=0

    for(var i in guests){
      var data = guests[i]
      if(data.isAdmin){
        continue
      }
      all_guest++
      if(data.will_come){
      attending++
      }else{
        if(!data.forRsvp){
          console.log(data.first_name)
          n_attending++
        }   
      }      
      if(data.forRsvp){
        pendings++
      }      
    }

    this.footer_details={
      attending,n_attending,all_guest,pendings
    }    
  }
  changeSort(value:string){
    if(value === this.sortValue){
      if(this.sortFlow){
        this.sortFlow = false
      }else{
        this.sortFlow = true
      }
    }
    this.sortValue = value
    
  }
  expandItem(item): void {
   
    if (item.expanded) {
      item.expanded = false;
    } else {          
      this.guest_array.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });

    }
  }
 
  reRoute(page:string){
    console.log(page)
    this.router.navigateByUrl(page);  
  }
}
