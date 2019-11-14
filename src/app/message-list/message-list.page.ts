import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'
import { NavController } from '@ionic/angular';
import { NavigationExtras  } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';
import { async } from '@angular/core/testing';
import { debug } from 'util';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {
  
  private currentChats : any = []
  constructor( 
    private authServ : AuthService,
    private navCtrl : NavController,
    private chatServ : ChatService
  ) { }

  ngOnInit() {
   
  }
  async ionViewDidEnter(){
    this.currentChats = []    
      // var data = this.authServ.userGuestDetails
      // console.log(data)
      // let {chat_id , isAdmin ,uid  } = data 
      let chat_id , isAdmin ,uid;
          this.authServ.currentUserData().then( async data=>{
            isAdmin = data.isAdmin
            chat_id = data.chat_id
            uid = data.uid
      if(isAdmin){
        this.chatServ.getAllChat().subscribe(data=>{   
          data.map(chat=>{
            this.currentChats.push({
              name: chat["group_name"],
              notifs : 0
            })
          })        
        })
      }else{
        
        this.chatServ.getUserChat(chat_id).then(data=>{
          data.map(chat =>{           
            chat.subscribe(data=>{                 
              this.currentChats = this.pushToArray(this.currentChats,data,uid)
            })
          })
        })         
      }
    })
  }
  
  pushToArray(arr, obj,uid) {
    const index = arr.findIndex((e) => e.name === obj.chat_id);   
    const {chat_id ,inbox} = obj
    if (index === -1) {
        arr.push({
          name :chat_id,
          notifs : inbox.find(({user_id})=> user_id === uid).message_count
        });
    } else {
        arr[index] =
         {
          name :chat_id,
          notifs : inbox.find(({user_id})=> user_id === uid).message_count
        };
    }
    return arr
  }
  goToChat (group_name) {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            group_id: group_name,
        }
    };
    this.navCtrl.navigateForward(['messages'], navigationExtras);
  }

}
