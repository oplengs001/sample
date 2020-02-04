import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
@Component({
  selector: 'app-visas',
  templateUrl: './visas.page.html',
  styleUrls: ['./visas.page.scss'],
})
export class VisasPage implements OnInit {
  
  constructor(
    private homeMenu: HomeMenuPage,
    private annServe: AnnouncementSaveService
  ) { }

  ngOnInit() {
    
  }
  openLink(url){
    // window.open(url, '_system');
  }
}
