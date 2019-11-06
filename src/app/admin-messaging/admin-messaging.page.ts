import { Component, OnInit } from '@angular/core';
import { ModalController,ActionSheetController  } from '@ionic/angular';
import { CreateGroupPage } from '../modals/create-group/create-group.page';
import { ChatService , GroupChat} from '../services/chat/chat.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras  } from '@angular/router';
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
    private navCtrl : NavController,
    ) {
      this.group_chats = this.ChatServ.getAllChat();
  }
  async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: CreateGroupPage,
          componentProps: {
            group_details:{
              group_name:"",
              group_id:""
            },
            SavingModal : false,
            EditingModal : true,
            aParameter: true,
            otherParameter: new Date()
          }
    });          
    await modal.present();
  }
  async editGroup(group_details:any) {
    console.log(group_details)
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: CreateGroupPage,
          componentProps: {
            group_details :group_details, 
            SavingModal : true,
            EditingModal : false,
            aParameter: true,
            otherParameter: new Date()
          }
    });          
    await modal.present();
  }
  async presentActionSheet(group) {
    const {id} = group
    let navigationExtras: NavigationExtras = {
        queryParams: {
            group_id: group.id,
        }
    };
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
      {
        text: 'Go to Chat',
        icon: 'arrow-dropright-circle',
        handler: () => {
          this.navCtrl.navigateForward(['messages'], navigationExtras);
          console.log('Play clicked');
        }      
      },
      {
        text: 'Edit',
        icon: 'md-create',
        handler: () => {
          this.editGroup(group)
          console.log('Share clicked');
        }
      },
      {
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
