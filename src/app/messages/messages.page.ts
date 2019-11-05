import { Component, OnInit ,ViewChild , ViewChildren ,QueryList} from '@angular/core';
import { IonContent,IonInfiniteScroll  ,IonTextarea } from '@ionic/angular';
import { ChatService } from '../services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { debug } from 'util';
import { FooterComponent} from '../footer/footer.component'
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
  hide_scroll:boolean
  constructor(
    public cs: ChatService,
    public auth : AuthService,
    private route: ActivatedRoute,
    private footerFunc : FooterComponent
  ) {    
    this.route.queryParams.subscribe(params => {
      this.id = params["group_id"];      
    });
  }

  ngOnInit(){

  }
  ngAfterViewInit(){  
    // this.things.changes.subscribe(t => {
    //   console.log("changes")
    //   if(t.length >0){
    //     setTimeout(()=>{
    //       this.Scroll_Message = " "
    //     },500)
 
    //   }
    // })     
  }  
  loadData(event) {      
    setTimeout(() => {       
      console.table({
        currentLength : this.current_length,
        limit : this.limit
      })
      if(this.current_length !== undefined){
        if ( this.limit >= this.current_length) {
          this.cs.joinUsers(this.cs.get(this.id),this.current_length).then(data=>{     
            this.chat$ = data            
            this.infiniteScroll.disabled = true
            this.hide_scroll = true
          });      
        }else{
          this.limit = this.limit + 8
          this.cs.joinUsers(this.cs.get(this.id),this.limit).then(data=>{     
            this.chat$ = data           
            this.content.scrollToPoint(0,95,1500)            
            this.infiniteScroll.complete()
            
          });    
        }
      }else{
        this.infiniteScroll.complete()
      }    
    }, 250);
  }
  scrollToBottom(value) {
    setTimeout(()=>{   
      this.content.scrollToBottom(value);
    },500)
  }
  ionViewWillEnter() {
   
  }
  seen_chat(){
    this.cs.seen_chat(this.id).then(seen =>{  
      console.log(seen)
      if(seen.continue){
        this.footerFunc.SubrcibeToOwnTopics()
        this.footerFunc.ClearNotifs(seen.count)
      }else{

      }
    })
  }
  ionViewDidLeave(){
    // this.current_length
  }
  ionViewDidEnter (){    
    this.seen_chat()      
    this.currentUser = this.auth.currentUserId()
    // const source = this.cs.get("Entourage");
    // const source = this.cs.get(this.id);
    this.hide_scroll = false
    this.limit = 8    
    this.cs.joinUsers(this.cs.get(this.id),this.limit).then(data=>{
      this.chat$ = data
      data.subscribe(data=>{                    
        this.infiniteScroll.disabled = false      
        this.current_length = data.messages_length       
        this.scrollToBottom(1500)
        if(this.current_length < 8){
          this.hide_scroll = true
        }
      })
    });
  
  }

  submit(chatId) {   
    var message = this.newMsg
      if(this.newMsg === '' || this.newMsg.length === 0 || !message.replace(/\s/g, '').length ){
        console.log("do nothing")
      }else{
        this.newMsg = this.newMsg.trim();
        this.cs.sendMessage(chatId, this.newMsg);
        this.newMsg = ''
     
          this.scrollToBottom(1500)
 
      }
     }

  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }

}
