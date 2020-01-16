import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { GeneralInfoService} from "../../services/content/general-info.service"
@Component({
  selector: 'app-charity',
  templateUrl: './charity.page.html',
  styleUrls: ['./charity.page.scss'],
})
export class CharityPage implements OnInit {
  charity :any
  constructor( 
     private homeMenu: HomeMenuPage,
     private generalInfo : GeneralInfoService,
     ) { }

  ngOnInit() {
    this.generalInfo.getWeddingInfoTakeOne().subscribe(data=>{      
      this.charity = data[0]
    })
  }

}
