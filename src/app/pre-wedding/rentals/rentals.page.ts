import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.page.html',
  styleUrls: ['./rentals.page.scss'],
})
export class RentalsPage implements OnInit {

  constructor(private homeMenu: HomeMenuPage) { }

  ngOnInit() {
  }
  openLink(url){
    window.open(url, '_system');
  }
}
