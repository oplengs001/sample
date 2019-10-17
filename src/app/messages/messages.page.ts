import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  chat$: Observable<any>;
  newMsg: string; 
  currentUser :string;  
  id: any;
  constructor(
    public cs: ChatService,
    public auth : AuthService,
    private route: ActivatedRoute,

  ) {
    this.route.queryParams.subscribe(params => {
      this.id = params["group_id"];      
    });
  }

  ngOnInit(){

  }
  ionViewDidEnter (){
    this.currentUser = this.auth.currentUserId()
    // const source = this.cs.get("Entourage");
    const source = this.cs.get(this.id);
    this.chat$ = this.cs.joinUsers(source);
  }

  submit(chatId) {
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }

}
