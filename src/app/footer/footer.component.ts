import { Component, OnInit ,Injectable} from '@angular/core';
import {  Router } from '@angular/router';
import { TransitionsService } from '../services/native/transitions.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { AuthService } from '../services/auth/auth.service';
import { ChatService } from '../services/chat/chat.service';
import { Badge } from '@ionic-native/badge/ngx';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class FooterComponent   {
  inbox_count : number = 0
  inbox_hide :boolean
  constructor(
    private fcm: FCM, 
    private router: Router,
    private transServe : TransitionsService,
    private chatServ : ChatService,
    private authServ : AuthService,
    private badge: Badge
    ) {
    this.inbox_hide = true
   }


  ngOnInit() {
    this.SubrcibeToOwnTopics()    
  }
  SubrcibeToOwnTopics():void {
    this.authServ.currentUserData().then( async(data)=>{
      let {chat_id} = data
      var inbox_count = 0
      for(var i in chat_id ){
        inbox_count += await this.chatServ.get_inbox(chat_id[i]) 
        this.fcm.subscribeToTopic(chat_id[i]);  
      }
      if(inbox_count !== 0){
        this.inbox_hide = false
      }else{
        this.inbox_hide = true
      }
      this.badge.set(inbox_count);
      this.inbox_count = inbox_count;
    })
  }
  addBadge():void{
    this.badge.increase(1)
  }
  ClearNotifs(notifs:number):void{
    this.badge.decrease(notifs)
  }
  goToNotifications() {
    this.router.navigateByUrl('/announcements');
  }
  goToMessages() {
    this.router.navigateByUrl('/message-list');
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }
  goToItenerary (){
    this.transServe.reRouteActivityNoAnimation("Itenerary")
  }
}
