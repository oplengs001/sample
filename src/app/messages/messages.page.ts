import { Component, OnInit ,ViewChild , ElementRef} from '@angular/core';
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
  @ViewChild("content", { read: ElementRef,static:false }) content: ElementRef;
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
  scrollToBottomOnInit() {
    console.log("socococo")
    this.content.nativeElement.scrollToBottom(300);
  }
  ionViewDidEnter (){
    
    this.currentUser = this.auth.currentUserId()
    // const source = this.cs.get("Entourage");
    const source = this.cs.get(this.id);
    this.cs.joinUsers(source).then(data=>{
      this.chat$ = data
      // this.scrollToBottomOnInit()
    });
    
    
  }

  submit(chatId) {
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }

}
