import { Component, OnInit } from '@angular/core';
import { ChatService , GroupChat} from '../services/chat/chat.service';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { NavigationExtras  } from '@angular/router';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {
  private group_chats: Observable<GroupChat[]>;
  constructor(
    private ChatServ : ChatService,
    private navCtrl : NavController,

  ) {
    this.group_chats = this.ChatServ.getAllChat();
   
   }

  ngOnInit() {

  }
  goToChat (group) {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            group_id: group.id,
        }
    };
    this.navCtrl.navigateForward(['messages'], navigationExtras);
  }

}
