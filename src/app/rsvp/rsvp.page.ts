import { Component, OnInit } from '@angular/core';
import {GuestAddService} from "../services/guest-add/guest-add.service"
import {AppComponent} from "../../app/app.component"
import { ActionClass} from "../gallery-action-sheet/actionsheet"
import { TransitionsService } from '../services/native/transitions.service';
@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.page.html',
  styleUrls: ['./rsvp.page.scss'],
})
export class RsvpPage implements OnInit {

  constructor(
    private guestService : GuestAddService,
    private appComponent : AppComponent,
    private actionSheet : ActionClass,
    private tranServe : TransitionsService
  ) { }

  updateStatus(value){
    var message = "you are declining the invitation"
    
    if(value){
      message = "you are accepting the invitation"
    }
      this.actionSheet.confirmationMessage(message).then(data=>{
        if(data){
          this.guestService.updateStatus(this.appComponent.userID,value).then(data=>{
            if(value){
              this.actionSheet.customAlert("Welcome","Thanks for Accepting the invitation")
            }else{
              this.actionSheet.customAlert("Welcome","Hope You Change your Mind!")
            }
            this.tranServe.reRoute("/")
          })
        }
      })

  }
  ngOnInit() {
  }

}
