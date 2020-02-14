import { Component, OnInit ,Injectable} from '@angular/core';
import {  Router } from '@angular/router';
import { TransitionsService } from '../services/native/transitions.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { AuthService } from '../services/auth/auth.service';
import { ChatService } from '../services/chat/chat.service';
import { Badge } from '@ionic-native/badge/ngx';
import { GuestAddService, Guest} from "../services/guest-add/guest-add.service"
import { AnnouncementSaveService  } from "../services/announcements/announcement-save.service"
import { Observable, Subscription } from 'rxjs';
import { debug } from 'util';
import { disableDebugTools } from '@angular/platform-browser';
import { GeneralInfoService } from '../services/content/general-info.service';
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
  public notif_count : number
  public isAdmin : boolean
  public forRsvp : boolean
  public will_come : boolean
  public GCsubs : Subscription;
  public GuestObservable : Observable<Guest>
  inbox_hide :boolean 
  notif_hide : boolean
  public GCsubsList : any =[] 
  public currentChats : any = []
  public rsvpList : any =[]
  public onItinerary : boolean
  public onChat : boolean
  constructor(
    private fcm: FCM, 
    private router: Router,
    private transServe : TransitionsService,
    private chatServ : ChatService,
    private authServ : AuthService,
    private badge: Badge,
    private guestServe : GuestAddService,   
    private announcementServices : AnnouncementSaveService,
    private gInfo : GeneralInfoService
    ) {
    this.inbox_hide = true
    this.GCsubs = new Subscription()

   }


  ngOnInit() {
    this.SubrcibeToOwnTopics()    
  
  }

  SubrcibeToOwnTopics() {
 
    this.authServ.currentUserData().then( async(data)=>{  
      this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
        this.gInfo.general_info = data[0] 
        console.log(data)
      })  
      let {chat_id , isAdmin ,uid ,forRsvp} = data 
      //  this.inbox_count = 0
      this.isAdmin = isAdmin
      this.forRsvp = forRsvp
    
      this.chatNotifSubs(chat_id)
      if(isAdmin){        
        this.fcm.subscribeToTopic("adminNotif")        
        // this.getAllGC()
        this.userDataSubscribe(chat_id,uid) 
        this.announcementServices.getNotifs().subscribe(data=>{                
          this.announcementServices.RsvpNotif = data     
          this.announcementServices.RsvpNotifCount = this.countUnreadAdminNotif(data);
          this.badge.set( this.announcementServices.RsvpNotifCount);  
          
        })
        
        this.guestServe.getRestrictedGuests().subscribe( async data=>{              
          this.guestServe.diet_guests = data.filter(guest => guest.diet_restriction !== undefined && guest.diet_restriction !== "none" && guest.diet_restriction !== "")   
          this.guestServe.bus_guests = data.filter(guest => guest.bus_reservation !== undefined && guest.bus_reservation !== 0)     
        })    
      }else{         
        this.announcementServices.RsvpNotifCount = 0  
        this.userDataSubscribe(chat_id,uid)     
      }      
    })
  }   
  // getAllGC(){
  //   this.chatServ.getAllChatOnce().then(data=>{   
  //     data.map(chat=>{
  //       console.log(chat)
  //       this.fcm.subscribeToTopic(chat.id)
  //       this.currentChats = this.pushToArray(this.currentChats,chat,this.authServ.currentUserId(),true)
  //     })        
  //   })  
  // }
  adminUnsubscribeAllChat():Promise<any>{
    return this.chatServ.getAllChatOnce().then(data=>{   
      data.map(chat=>{
        console.log(chat)
        this.fcm.unsubscribeFromTopic(chat.id)
      })        
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
      const {notif_count ,chat_id ,forRsvp , will_come} = data
        this.authServ.userGuestDetails = data
        this.forRsvp = forRsvp
        this.will_come = will_come
        this.notif_count = notif_count    
        this.notif_hide = notif_count!==0 ? false : true 
       const currentChatId = this.currentChats.map(arr=>arr.name),
       newChatid = chat_id,      
       forRemoved = this.checkUnique(currentChatId,newChatid),
       forSubscription =  this.checkUnique(newChatid,currentChatId)

        //forSubscription = this.currentChats.length ===0? newChatid :newItem
        
        //normal initialize subscription        
        if(forRemoved.length !==0){
          this.removeSub(forRemoved)
        }
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
      var chatSub = chat.subscribe(data=>{    
        if(data.uid){
          this.dataSet(data,uid)  
        }
        this.badge.set(this.inbox_count + this.notif_count );  
        if(this.isAdmin){
          this.badge.set(this.inbox_count + this.announcementServices.RsvpNotifCount + this.notif_count )
        }
      })                   
      this.GCsubsList.push({
        subs : chatSub,
        name : entered[index]
      })
      this.fcm.subscribeToTopic(entered[index])
    })
    console.log(this.GCsubsList)
    this.authServ.userChatSubs = this.GCsubsList
  }
  unsubscribeAllChat():Promise<any>{
    if(this.authServ.userGuestDetails["isAdmin"]){
      this.fcm.unsubscribeFromTopic("adminNotif")
      this.fcm.unsubscribeFromTopic("enappd")
     return this.adminUnsubscribeAllChat()
    }else{
    
      this.fcm.unsubscribeFromTopic("adminNotif")
      this.fcm.unsubscribeFromTopic("enappd")  
      for(var i = 0 ; i < this.authServ.userChatSubs.length ; i++ ){
        console.log(this.authServ.userChatSubs[i].name)
        this.authServ.userChatSubs[i].subs.unsubscribe()  
        this.fcm.unsubscribeFromTopic(this.authServ.userChatSubs[i].name)
    
      }
      this.GCsubsList = []
      this.authServ.userChatSubs = []
      return this.adminUnsubscribeAllChat()
    }
  } 
  removeSub(items){
    
    this.remItem(items)      
  }
  dataSet(data,uid){
    this.currentChats = this.pushToArray(this.currentChats,data,uid,false)
    this.inbox_count = this.countInbox(this.currentChats,uid)       
    this.inbox_hide = this.inbox_count!==0 ? false : true
  }
  addBadge():void{
    this.badge.increase(1)
  }
  ClearNotifs(notifs:number):void{
    console.log(notifs)
    this.badge.decrease(notifs)    
  }
  clearBadge(){
    this.badge.clear()
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
  goToItinerary (){
    this.transServe.reRouteActivityNoAnimation("Itinerary")
  }  
  reRoute(loc:string){
    this.transServe.reRouteNoAnimation(loc)
  }
  ionViewDidEnter (){        
  }
  ionViewDidLeave(){ 
    // console.log("leave")
    // this.GCsubs.unsubscribe()
  }
  pushToArray(arr:any, chat_data:any,uid:string,admin:boolean) {    
    const index = arr.findIndex((e) => e.name === chat_data.id);       
    //looking if new data does exist in the current chat
    const {id ,inbox,group_name,messages,createdAt} = chat_data
 
    const notifs = admin ? 0 : inbox.find(({user_id})=> user_id === uid).message_count

    const last_chat = messages.length === 0 ? "" : messages[messages.length-1].content
    const last_chat_time = messages.length === 0 ? "" : messages[messages.length-1].createdAt
    if (index === -1) {
        arr.push({
          name :id,
          group_name : group_name,
          createdAt : createdAt,
          notifs :notifs,
          last_chat : last_chat,
          last_chat_time:last_chat_time,
          inbox : inbox,
          id: id
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
  countUnreadAdminNotif(data){
    return data.reduce(
      (sum,notif)=>{
      var it=notif.status=="unread"?1:0
      return sum + it       
      },0)
  }
  remItem(forRemoved) {    
    for(var i in forRemoved){
      this.fcm.unsubscribeFromTopic(forRemoved[i])
      const index = this.currentChats.findIndex((e) => e.name === forRemoved[i])
      const subIndex = this.GCsubsList.findIndex((e) => e.name === forRemoved[i])
      this.currentChats.splice(index,1)
      this.GCsubsList[subIndex]["subs"].unsubscribe()      
    }            
  }

}
