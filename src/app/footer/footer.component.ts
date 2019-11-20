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
  public inbox_count : number =0
  public isAdmin : boolean
  inbox_hide :boolean
  public currentChats : any = []
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

  SubrcibeToOwnTopics() {
 
    this.authServ.currentUserData().then( async(data)=>{  
    
      let {chat_id , isAdmin ,uid  } = data 
      //  this.inbox_count = 0
      for(var i in chat_id ){      
        this.fcm.subscribeToTopic(chat_id[i]);  
      }
      if(isAdmin){        
        this.chatServ.getAllChatOnce().then(data=>{   
           data.map(chat=>{        
             this.currentChats = this.pushToArray(this.currentChats,chat,uid,true)
           })        
         })
      }else{        
           this.chatServ.getUserChat(chat_id).then(data=>{
             data.map(chat =>{           
               chat.subscribe(data=>{                                
                 this.currentChats = this.pushToArray(this.currentChats,data,uid,false)
                 this.inbox_count = this.countInbox(this.currentChats,uid)       
                 this.inbox_hide = this.inbox_count!==0 ? false : true
                 this.badge.set(this.inbox_count);   
               })
             })
           })
      }
      
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
  pushToArray(arr:any, obj:any,uid:string,admin:boolean) {
    const index = arr.findIndex((e) => e.name === obj.id);       
    const {id ,inbox,group_name,messages} = obj    
    const notifs = admin ? 0 : inbox.find(({user_id})=> user_id === uid).message_count  
    const last_chat = messages.length === 0 ? "" : messages[messages.length-1].content
    const last_chat_time = messages.length === 0 ? "" : messages[messages.length-1].createdAt
    if (index === -1) {
        arr.push({
          name :id,
          group_name : group_name,
          notifs :notifs,
          last_chat : last_chat,
          last_chat_time:last_chat_time
        });
    } else {
        arr[index] =
         {
          name :id,
          group_name : group_name,
          notifs : notifs,
          last_chat : last_chat,
          last_chat_time:last_chat_time
        };
    }
    return arr
  }
  countInbox(arr:any,uid:string){
    return arr.reduce((sum,b)=>{      
      return sum +  b.notifs
    },0)
  }
}
