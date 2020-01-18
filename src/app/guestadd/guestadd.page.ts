import { Component, OnInit } from '@angular/core';
import { GuestAddService, Guest } from "../services/guest-add/guest-add.service"
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toaster/toast-service';
import { ActionClass } from '../gallery-action-sheet/actionsheet'
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { GeneralInfoService} from "../services/content/general-info.service"
import { NotificationService } from "../services/alerts/notification.service"
import {  Router } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';
@Component({
  selector: 'app-guestadd',
  templateUrl: './guestadd.page.html',
  styleUrls: ['./guestadd.page.scss'],
})
export class GuestaddPage implements OnInit {

  guest: Guest = {
    first_name: '',
    last_name: '', 
    number: '',
    email: '',    
    chat_id : ["gchat"],
    isAdmin: false,
    forRsvp : true,
    will_come : false,
    notif_count:0,        
    color: this.getRandomColor(),
    diet_restriction: "None",
    bus_reservation : 0,
    reservation_status : "pending"

  };
  password : string;
  guestForm : FormGroup
  api : string
  constructor(  
    private guestService : GuestAddService,
    private authService : AuthService,
    private toastService: ToastService,
    private actions : ActionClass,
    private formBuilder : FormBuilder,
    private router : Router,
    private gInfo : GeneralInfoService,
    private notifs : NotificationService,
    private chats : ChatService
    ) { 
      this.guestForm = this.formBuilder.group({
        first_name : ['', Validators.required],        
        last_name : ['', Validators.required],      
        number : ['', Validators.required],
        email : ['',  Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])],          
        password : [this.getRandomPassword(), Validators.required],       
        isAdmin : [false, Validators.required],        
      });
    }
  ngOnInit() {
    this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
      var {admin_site} = data[0]
      this.api = admin_site
    })
  }
  addGuest() {          
    if(this.guestForm.valid){
      let {
         first_name,
         last_name,      
         number,
         email,
         password,
         isAdmin         
       }  = this.guestForm.value
      this.guest ={
        first_name,
        last_name,    
        number,
        email,
        chat_id: ["gchat"],
        isAdmin,
        forRsvp: true,
        will_come : false,
        notif_count :0,            
        color: this.getRandomColor(),
        diet_restriction: "None",
        bus_reservation : 0,
        reservation_status : "pending"
      }    
      this.password = password
      let message = "You are about to add a Guest"
      this.actions.confirmationMessage(message).then(res=>{
      
        if(res){      
          this.authService.workAroundSignUp(this.guest.email, this.password).then((value)=>{
            console.log(value)
            if(value.code === "auth/email-already-in-use"){              
              this.actions.customAlert("Opps!",value.message)
              this.toastService.showToast('There was a problem adding your Guest '+value.message);
              return null;
            }
          
            if(value.user){
              this.guest.uid = value.user.uid
              this.guestService.addGuest(this.guest).then(() => {
                this.chats.AddGuestToGeneral("gchat",this.guest.uid).then(()=>{
                  this.toastService.showToast('Guest added');
                  this.actions.customAlert("Success!","Guest Added!")
                  this.notifs.welcomeEmail(this.guest,this.password)
                  this.emptyForm()
                })
              }, err => {
                this.actions.customAlert("Opps!",err.message)
                this.toastService.showToast('There was a problem adding your Guest '+err.message);       
                return  null         
              });
            }
          }).catch(err =>{
            console.log(err)
            this.actions.customAlert("Opps!",err.message)
            this.toastService.showToast('There was a problem adding your Guest '+err.message);
            
          })
        }
      })
    } else{
      if(this.guestForm.controls.email.status === "INVALID"){
        this.actions.customAlert("Warning","Email is Incorrect")
      }else{
        this.actions.inputAlert()
      }
   
    }   
  }
  emptyForm(){
    this.guest = {
      first_name: '',
      last_name: '',
      number: '',
      email: '',    
      chat_id : ["gchat"],
      isAdmin: false,
      forRsvp: true,
      will_come : false,
      notif_count : 0,            
      color: this.getRandomColor(),
      diet_restriction: "None",
      bus_reservation : 0,
      reservation_status : "pending"
    };
    this.guestForm.setValue(
      {
        first_name: '',
        last_name: '',     
        number: '',
        email: '',   
        password :'',        
        isAdmin: false,
      }
    )
  }
  
  deleteGuest() {
    this.guestService.deleteGuest(this.guest.uid).then(() => {   
      this.toastService.showToast('Guest deleted');
    }, err => {
      this.toastService.showToast('There was a problem deleting your Guest :(');
    });
  }
  updateGuest() {
    this.guestService.updateGuest(this.guest).then(() => {
      this.toastService.showToast('Guest updated');
    }, err => {
      this.toastService.showToast('There was a problem updating your Guest :(');
    });
  } 
  reRoute(page:string){
    console.log(page)
    this.router.navigateByUrl(page);
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  getRandomPassword(){
   return  String(Math.floor(100000 + Math.random() * 900000))
  }
}

