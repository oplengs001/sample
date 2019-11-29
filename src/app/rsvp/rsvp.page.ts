import { Component, OnInit ,Injectable} from '@angular/core';
import {GuestAddService} from "../services/guest-add/guest-add.service"
import { ActionClass} from "../gallery-action-sheet/actionsheet"
import { AuthService } from '../services/auth/auth.service'
import { TransitionsService } from '../services/native/transitions.service';
@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.page.html',
  styleUrls: ['./rsvp.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class RsvpPage implements OnInit {

  constructor(
    private guestService : GuestAddService,
    private authServ : AuthService,
    private actionSheet : ActionClass,
    private tranServe : TransitionsService
  ) { }

  updateStatus(value):Promise<any>{
    var message = "you are declining the invitation"
    var userDetails = this.authServ.userGuestDetails
    if(value){
      message = "you are accepting the invitation"
    }
     return this.actionSheet.confirmationMessage(message).then(data=>{
        if(data){
          this.guestService.updateStatus(userDetails,value).then(data=>{
            if(value){
              this.actionSheet.customAlert("Hello!","Thanks for Accepting the invitation")
            }else{
              this.actionSheet.customAlert("Ow..","Hope You Change your Mind!")
            }
            this.tranServe.reRoute("/")
          })
        }
      })

  }
  ngOnInit() {
  }

}
