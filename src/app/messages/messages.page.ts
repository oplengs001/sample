import { Component, OnInit ,ViewChild , ViewChildren ,QueryList} from '@angular/core';
import { IonContent,IonInfiniteScroll  ,IonTextarea } from '@ionic/angular';
import { ChatService } from '../services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { debug } from 'util';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})

export class MessagesPage implements OnInit {  
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChildren('messages') things: QueryList<any>;

  chat$: Observable<any>;
  public newMsg: string; 
  currentUser :string;  
  id: any;
  limit:number
  current_length :number
  SeeMore: boolean
  constructor(
    public cs: ChatService,
    public auth : AuthService,
    private route: ActivatedRoute,

  ) {
    this.SeeMore = false
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
          // this.scrollToBottom()
        },500)
 
      }
    })  
   
  }  
  loadData(event) {
    setTimeout(() => {
      console.log('Done'); 
      console.log(this.current_length)
      console.log(this.limit)
      if (this.current_length <= this.limit) {
        this.cs.joinUsers(this.cs.get(this.id),this.current_length).then(data=>{     
          this.chat$ = data
        });
        this.SeeMore = true
        event.target.disabled = true;
      }else{
        
        this.limit = this.limit + 8
        this.cs.joinUsers(this.cs.get(this.id),this.limit).then(data=>{     
          this.chat$ = data
          
        });
        event.target.complete(); 
      }
    }, 500);
  }
  scrollToBottom() {
    setTimeout(()=>{
      this.content.scrollToBottom(1500);
    },500)
  }
  ionViewWillEnter() {
   
  }
  seen_chat(){
    this.cs.seen_chat(this.id)
  }
  ionViewDidEnter (){    
    this.seen_chat()  
    this.currentUser = this.auth.currentUserId()
    // const source = this.cs.get("Entourage");
    // const source = this.cs.get(this.id);
    this.limit = 8

    this.cs.joinUsers(this.cs.get(this.id),this.limit).then(data=>{
      this.chat$ = data
      data.subscribe(data=>{ 
        this.scrollToBottom()
        
        this.current_length = data.messages_length
      })
    });
  
  }

  submit(chatId) {   
    
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = ''
    this.newMsg = this.newMsg.trim();
      this.scrollToBottom()
  }

  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }

}
