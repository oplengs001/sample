import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'
import { NavController } from '@ionic/angular';
import { NavigationExtras  } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';
import { async } from '@angular/core/testing';
import { debug } from 'util';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../footer/footer.component'
import { SharedComponent } from '../shared-component/shared';
import { AnnouncementSaveService } from '../services/announcements/announcement-save.service';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {
  private AllChatSubs = new Subscription()
  private currentChats : any
  constructor( 
    private authServ : AuthService,
    private navCtrl : NavController,
    private chatServ : ChatService,
    private footer : FooterComponent,
    private sharedComps : SharedComponent,
    private annServe : AnnouncementSaveService
  ) { }


  ngOnInit(){
   this.currentChats = this.footer.currentChats

  }
  ionViewDidLeave (){  
    this.AllChatSubs.unsubscribe()    
  }
  ionViewDidEnter(){
    var isAdmin
    if(this.authServ.userGuestDetails){
      isAdmin = this.authServ.userGuestDetails["isAdmin"]
      if(isAdmin){      
        this.footer.getAllGC()
      }
    }else{
      this.authServ.currentUserData().then(data=>{     
        isAdmin = data.isAdmin    
        if(isAdmin){      
          this.footer.getAllGC()
        }
      })
    }       
  }
  ngOnDestroy(){    
    this.AllChatSubs.unsubscribe()
  }
  goToChat (group_name) {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            group_id: group_name,
        }
    };
    this.navCtrl.navigateForward(['messages'], navigationExtras);
  } 
}
