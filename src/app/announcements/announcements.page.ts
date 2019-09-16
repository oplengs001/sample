import { Component, OnInit } from '@angular/core';
import { AnnouncementSaveService , Announcement } from "../services/announcements/announcement-save.service"
import { Observable } from 'rxjs';
@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {
  private announcements: Observable<Announcement[]>;
  constructor(
    private announcementService : AnnouncementSaveService
  ) { }

  ngOnInit() {
    this.announcements =  this.announcementService.getAnnouncements()
  }

}
