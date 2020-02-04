import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.page.html',
  styleUrls: ['./rentals.page.scss'],
})
export class RentalsPage implements OnInit {

  constructor(
    private homeMenu: HomeMenuPage,
    private annServe: AnnouncementSaveService) { }

  ngOnInit() {
  }
  openLink(url){
    // window.open(url, '_system');
  }
}
