import { Component, OnInit ,ViewChild , ViewChildren ,QueryList} from '@angular/core';
import { IonContent,IonInfiniteScroll   } from '@ionic/angular';
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
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChildren('messages') things: QueryList<any>;
  chat$: Observable<any>;
  public newMsg: string; 
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
  ngAfterViewInit(){  
    this.things.changes.subscribe(t => {
      console.log("changes")
      if(t.length >0){
        setTimeout(()=>{
          this.scrollToBottom()
        },500)
 
      }
    })  
  }  
  scrollToBottom() {
    this.content.scrollToBottom(1500);
  }
  ionViewDidEnter (){
    
    this.currentUser = this.auth.currentUserId()
    // const source = this.cs.get("Entourage");
    const source = this.cs.get(this.id);
    this.cs.joinUsers(source).then(data=>{
      this.chat$ = data      
    });
    
    
  }

  submit(chatId) {   
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = ''
    this.newMsg = this.newMsg.trim();
  }

  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }

}
