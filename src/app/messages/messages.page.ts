import { Component, OnInit ,ViewChild , ViewChildren ,QueryList} from '@angular/core';
import { IonContent,IonInfiniteScroll  ,IonTextarea } from '@ionic/angular';
import { ChatService } from '../services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
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
  current_index :number
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
    // })     
  }  
  loadData(event) {      
    setTimeout(() => {         
      if(this.current_length !== undefined){          
          
          this.limit = this.limit + 10
          if ( this.limit >= this.current_length) {          
            this.current_index = 0         
            this.infiniteScroll.disabled = true
            this.hide_scroll = true    
            this.limit = this.current_length
          }else{
            this.current_index = this.current_length-this.limit                       
            this.infiniteScroll.complete() 
          }
                 
      }else{
        this.infiniteScroll.complete()
      }       
      console.table({
        limit : this.limit,
        c_index : this.current_index,
        length : this.current_length
      })

    }, 250);
  }
  scrollToBottom(value) {
    setTimeout(()=>{   
      this.content.scrollToBottom(value);
    },150)
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
    this.hide_scroll = false
    this.limit = 9 
    this.infiniteScroll.disabled = false  
    // this.scrollToBottom(1500)    
    this.cs.joinUsers(this.cs.get(this.id)).then(data=>{
      this.chat$ = data
      data.subscribe(data=>{
        let from_seen = false
        if(this.current_length === data.messages.length){
          from_seen = true
        }
        this.current_length = data.messages.length 
        if(this.current_length <=8){
          this.infiniteScroll.disabled = true    
          this.hide_scroll = true
          this.limit = this.current_length
        }else{
          if(!from_seen){
            this.limit++
            this.infiniteScroll.disabled = false    
            this.hide_scroll = false  
            this.scrollToBottom(500)        
          }
        }
 
        this.current_index = this.current_length-this.limit
        console.table({
          c_index : this.current_index,
          limit : this.limit,
          current_length : this.current_length
        })
      })
      
   
    });
  
  }

  submit(chatId) {   
    var message = this.newMsg
      if(this.newMsg === '' || this.newMsg.length === 0 || !message.replace(/\s/g, '').length ){
        console.log("do nothing")
      }else{
        this.newMsg = this.newMsg.trim();
        this.cs.sendMessage(chatId, this.newMsg).then(data=>{        
          this.newMsg = ''
          // this.scrollToBottom(500)
        
        });
   
      }
     }

  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }

}
