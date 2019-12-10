import { Component, OnInit } from '@angular/core';
import { GeneralInfoService } from "../../services/content/general-info.service"
import { TransitionsService } from '../../services/native/transitions.service';
@Component({
  selector: 'app-rsvp-admin',
  templateUrl: './rsvp-admin.page.html',
  styleUrls: ['./rsvp-admin.page.scss'],
})
export class RsvpAdminPage implements OnInit {
  private info : any
  constructor(
    private gInfo : GeneralInfoService,
    private tranServe : TransitionsService
  ) { }

  ngOnInit() {
    this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
      this.info = data[0] 
      console.log(data)
    })    
  }
  reRoute(url){
    this.tranServe.reRoute(url)
  }
  saveItem(){    
    this.gInfo.updateInfo(this.info.ref,this.info).then(data=>{
      
    })
  }
}
