import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'
import { NavController } from '@ionic/angular';
import { NavigationExtras  } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';
import { async } from '@angular/core/testing';
import { debug } from 'util';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../footer/footer.component'
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {
  private AllChatSubs = new Subscription()
  private currentChats : any = []
  constructor( 
    private authServ : AuthService,
    private navCtrl : NavController,
    private chatServ : ChatService,
    private footerClass : FooterComponent
  ) { }


  ngOnInit(){
   this.currentChats = this.footerClass.currentChats
  }
  ionViewDidLeave (){
    this.AllChatSubs.unsubscribe()
  }
  
  ngOnDestroy(){
    console.log("leaved")
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
