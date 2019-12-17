import { Component, OnInit ,ViewChildren,QueryList} from '@angular/core';
import { AnnouncementSaveService , Announcement } from "../services/announcements/announcement-save.service"
import { TransitionsService } from '../services/native/transitions.service';
import { GuestAddService } from '../services/guest-add/guest-add.service';
import { AuthService } from '../services/auth/auth.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'], 
})
export class AnnouncementsPage implements OnInit   {
  @ViewChildren('events') ngForDetails: QueryList<any>;
  // private announcements: Observable<Announcement[]>;
  private announcements: any;
  private loaded : boolean
  constructor(
    private announcementService : AnnouncementSaveService,
    private transServe : TransitionsService,
    private authServ : AuthService,
    private guestFunc : GuestAddService
  ) { }
  ngAfterViewInit(){  
    this.ngForDetails.changes.subscribe(t => {   
      console.log(t)
        if(t.length){
          setTimeout(() => {        
          this.loaded = true
          },500)
        }
    })     
  }  
  ionViewDidEnter (){    
    var uid = this.authServ.currentUserId();   
    this.guestFunc.updateNotifCount(uid,"clear")
  }
  ngOnInit() {

    this.announcementService.getAnnouncements().subscribe(data=>{
      this.announcements = data
      this.loaded = true;
    })
  }
}
