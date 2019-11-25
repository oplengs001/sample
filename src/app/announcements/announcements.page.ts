import { Component, OnInit ,ViewChildren,QueryList} from '@angular/core';
import { AnnouncementSaveService , Announcement } from "../services/announcements/announcement-save.service"
import { TransitionsService } from '../services/native/transitions.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'], 
})
export class AnnouncementsPage implements OnInit   {
  @ViewChildren('events') ngForDetails: QueryList<any>;
  private announcements: Observable<Announcement[]>;
  private loading : boolean
  constructor(
    private announcementService : AnnouncementSaveService,
    private transServe : TransitionsService
    
  ) { }
  ngAfterViewInit(){  
    this.ngForDetails.changes.subscribe(t => {   
      console.log(t)
        if(t.length){
          setTimeout(() => {        
          this.loading = true
          },500)
        }
    })     
  }  
  ngOnInit() {
    this.loading = false;
    this.announcements =  this.announcementService.getAnnouncements()
  }
}
