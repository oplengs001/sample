import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'
import { NavController } from '@ionic/angular';
import { NavigationExtras  } from '@angular/router';
import { debug } from 'util';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {
  
  private currentChats : any
  constructor( 
    private authServ : AuthService,
    private navCtrl : NavController,
    
  ) {

    this.authServ.currentUserData().then((data)=>{   
      this.currentChats = data.chat_id  
    })
   }

  ngOnInit() {
    
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
