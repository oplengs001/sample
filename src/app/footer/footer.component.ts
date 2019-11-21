import { Component, OnInit ,Injectable} from '@angular/core';
import {  Router } from '@angular/router';
import { TransitionsService } from '../services/native/transitions.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { AuthService } from '../services/auth/auth.service';
import { ChatService } from '../services/chat/chat.service';
import { Badge } from '@ionic-native/badge/ngx';
import { GuestAddService} from "../services/guest-add/guest-add.service"
import { Observable, Subscription } from 'rxjs';
import { debug } from 'util';
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
  private GCsubs : Subscription;
  inbox_hide :boolean 
  private GCsubsList : any =[] 
  public currentChats : any = []
  constructor(
    private fcm: FCM, 
    private router: Router,
    private transServe : TransitionsService,
    private chatServ : ChatService,
    private authServ : AuthService,
    private badge: Badge,
    private guestServe : GuestAddService
    ) {
    this.inbox_hide = true
    this.GCsubs = new Subscription()
   }


  ngOnInit() {
    this.SubrcibeToOwnTopics()    
  }

  SubrcibeToOwnTopics() {
 
    this.authServ.currentUserData().then( async(data)=>{  
    
      let {chat_id , isAdmin ,uid  } = data 
      //  this.inbox_count = 0
      this.chatNotifSubs(chat_id)
      if(isAdmin){        
        this.chatServ.getAllChatOnce().then(data=>{   
           data.map(chat=>{        
             this.currentChats = this.pushToArray(this.currentChats,chat,uid,true)
           })        
         })
      }else{        
        this.userDataSubscribe(chat_id,uid)     
      }      
    })
  }  
  chatNotifSubs(chat_ids){
    for(var i in chat_ids ){      
      this.fcm.subscribeToTopic(chat_ids[i]);  
    }
  }
  userDataSubscribe(chat_id,uid){
    // this.chatSubscribe(chat_id,uid)
    this.guestServe.getGuestObs(uid).subscribe(data=>{  

       const currentChatId = this.currentChats.map(arr=>arr.name),
       newChatid = data.chat_id,      
       forRemoved = this.checkUnique(currentChatId,newChatid),
       forSubscription =  this.checkUnique(newChatid,currentChatId)
       
        //forSubscription = this.currentChats.length ===0? newChatid :newItem
        
        //normal initialize subscription        
        if(forRemoved.length !==0){this.removeSub(forRemoved)}
        if(forSubscription.length !==0){
          this.chatServ.getUserChat(forSubscription).then(data=>{          
            this.resubs(forSubscription,data,uid)    
          })  
        }
        
                
    })  
  }
  checkUnique(arr1,arr2){
    return arr1.filter((o)=> arr2.indexOf(o) === -1);  
  }
 
  resubs(entered,data,uid){   
    data.map((chat,index) =>{    
      const chatSub = chat.subscribe(data=>{        
        this.dataSet(data,uid)  
      })                 
      this.GCsubsList.push({
        subs : chatSub,
        name : entered[index]
      })
    })
  }
  removeSub(items){
    
    this.remItem(items)      
  }
  dataSet(data,uid){
    
    this.currentChats = this.pushToArray(this.currentChats,data,uid,false)
    this.inbox_count = this.countInbox(this.currentChats,uid)       
    this.inbox_hide = this.inbox_count!==0 ? false : true
    this.badge.set(this.inbox_count);  
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
    //looking if new data does exist in the current chat
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
  // filterArray (array,id){
  //   return array.filter 
  //   return original.filter((o)=> new_array.indexOf(o) === -1)
  // }
  countInbox(arr:any,uid:string){
    return arr.reduce((sum,b)=>{      
      return sum +  b.notifs
    },0)
  }
  remItem(forRemoved) {    
    for(var i in forRemoved){
      const index = this.currentChats.findIndex((e) => e.name === forRemoved[i])
      const subIndex = this.GCsubsList.findIndex((e) => e.name === forRemoved[i])
      this.currentChats.splice(index,1)
      this.GCsubsList[subIndex]["subs"].unsubscribe()
    }            
  }
}
