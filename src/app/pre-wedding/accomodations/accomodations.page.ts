import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { SharedComponent } from 'src/app/shared-component/shared';
@Component({
  selector: 'app-accomodations',
  templateUrl: './accomodations.page.html',
  styleUrls: ['./accomodations.page.scss'],
})
export class AccomodationsPage implements OnInit {

  constructor(private homeMenu: HomeMenuPage,
    private annServe: AnnouncementSaveService,
    private sharedComps : SharedComponent
    ) { }

  ngOnInit() {
  }
  openLink(url){
    // window.open(url, '_system');
  }
}
