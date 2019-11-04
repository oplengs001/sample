import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'
import { NavController } from '@ionic/angular';
import { NavigationExtras  } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {
  
  private currentChats : any = []
  constructor( 
    private authServ : AuthService,
    private navCtrl : NavController,
    private chatServ : ChatService
  ) { }

  ngOnInit() {
   
  }
  ionViewDidEnter(){
    this.currentChats = []
    this.authServ.currentUserData().then( async(data)=>{   
      console.log(data)
      let {chat_id} = data
 
      for(var i in chat_id ){
        this.currentChats.push({
          name :chat_id[i],
          notifs : await this.chatServ.get_inbox(chat_id[i]) 
        })
        
      }
    })
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
