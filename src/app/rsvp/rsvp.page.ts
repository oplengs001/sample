import { Component, OnInit ,Injectable} from '@angular/core';
import { HomeMenuPage } from '../modals/menu/home-menu.page'
import { GeneralInfoService } from "../services/content/general-info.service"
import { AuthService } from '../services/auth/auth.service'
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
  private isAdmin:boolean
  constructor(
    private home : HomeMenuPage,
    private authServ : AuthService,
    private gInfo  :GeneralInfoService
  ) { }
    
  ngOnInit() {
  
    this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
      this.info = data[0] 
      console.log(data)
    })
  } 
  ngAfterViewInit(): void {
    
    this.isAdmin = this.authServ.userDetails["isAdmin"]
    console.log(this.isAdmin)
  }

}
