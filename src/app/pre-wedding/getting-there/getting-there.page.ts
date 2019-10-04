import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
@Component({
  selector: 'app-getting-there',
  templateUrl: './getting-there.page.html',
  styleUrls: ['./getting-there.page.scss'],
})
export class GettingTherePage implements OnInit {

  constructor(private homeMenu: HomeMenuPage) { }

  ngOnInit() {
  }

}
