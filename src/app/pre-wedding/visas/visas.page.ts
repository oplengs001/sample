import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'

@Component({
  selector: 'app-visas',
  templateUrl: './visas.page.html',
  styleUrls: ['./visas.page.scss'],
})
export class VisasPage implements OnInit {
  
  constructor(
    private homeMenu: HomeMenuPage
  ) { }

  ngOnInit() {
  }

}
