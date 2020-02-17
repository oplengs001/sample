import { Component, OnInit ,Injectable} from '@angular/core';
import { HomeMenuPage } from '../modals/menu/home-menu.page'
import { GeneralInfoService } from "../services/content/general-info.service"
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.page.html',
  styleUrls: ['./rsvp.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class RsvpPage implements OnInit {
  info : any
  isAdmin : boolean
  cross_src : string
  constructor(
    private home : HomeMenuPage,
    private authServ :AuthService,
    private gInfo  :GeneralInfoService
  ) {

    this.cross_src = "../../assets/images/cross.png"
   }
    
  ngOnInit() {  
     
    this.isAdmin = this.authServ.userGuestDetails["isAdmin"]
    
    console.log(this.isAdmin)
  }  
  ionViewDidEnter (){
      this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
      this.info = data[0] 
      console.log(data)
    })       
  }
}
