import { Component, OnInit } from '@angular/core';
import { ModalController,ActionSheetController  } from '@ionic/angular';
import { CreateGroupPage } from '../modals/create-group/create-group.page';
import { ChatService , GroupChat} from '../services/chat/chat.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-admin-messaging',
  templateUrl: './admin-messaging.page.html',
  styleUrls: ['./admin-messaging.page.scss'],
})
export class AdminMessagingPage implements OnInit {
  private group_chats: Observable<GroupChat[]>;
  constructor(
    public modalController: ModalController,
    private actionSheetController : ActionSheetController,
    private ChatServ : ChatService,
    ) {
      this.group_chats = this.ChatServ.getAllChat();
  }
  async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: CreateGroupPage,
          componentProps: {
             aParameter: true,
             otherParameter: new Date()
          }
    });          
    await modal.present();
  }
  async presentActionSheet(group) {
    const {id} = group
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
      {
        text: 'Go to Chat',
        icon: 'arrow-dropright-circle',
        handler: () => {
          
          console.log('Play clicked');
        }      
      },
      {
        text: 'Edit',
        icon: 'md-create',
        handler: () => {
          console.log('Share clicked');
        }
      },
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log(id)
          console.log('Delete clicked');
        }
      },{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  ngOnInit() {    
   
   
  }

  
}
