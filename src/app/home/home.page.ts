import { Component , OnInit} from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toaster/toast-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pushes: any = [];
  constructor(
    private fcm: FCM,
    public plt: Platform,
    private toastService: ToastService,
    private authServ : AuthService
    ) {
    this.plt.ready()
      .then(() => {
        this.fcm.onNotification().subscribe(data => {
          console.log(data)
          if (data.wasTapped) {
            this.toastService.showToast("New Notification!")
            console.log("Received in background");
          } else {         
            this.toastService.showNotif("");
            console.log("Received in foreground");
          };
        });
      
        this.fcm.onTokenRefresh().subscribe(token => {
          // Register your new token in your back-end if you want
          // backend.registerToken(token);
          console.log(token) 
          console.log("fcm token for testing 1")
        });
      }).catch(error =>{
        console.log(error)
      })
  }
  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');  
    this.SubrcibeToOwnTopics()
  
  }
  SubrcibeToOwnTopics():void {
    this.authServ.currentUserData().then((data)=>{   
      console.log(data)
      let {chat_id} = data
      for(var i in chat_id ){
        console.log(chat_id[i])      
        this.fcm.subscribeToTopic(chat_id[i]);  
      }
    })
  }
  getToken() {
    this.fcm.getToken().then(token => {
      console.log(token) 
      console.log("fcm token for testing 2")
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }
  ngOnInit() {

    this.subscribeToTopic()
    
  }
}
