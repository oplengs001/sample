import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
@Component({
  selector: 'app-accomodations',
  templateUrl: './accomodations.page.html',
  styleUrls: ['./accomodations.page.scss'],
})
export class AccomodationsPage implements OnInit {

  constructor(private homeMenu: HomeMenuPage) { }

  ngOnInit() {
  }
  openLink(url){
    window.open(url, '_system');
  }
}
