import { OnInit,Injectable} from '@angular/core';
import { ActionSheetController ,AlertController} from '@ionic/angular';
import { ModalController, } from '@ionic/angular';
import { ToastService } from '../services/toaster/toast-service';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { AnnouncementSaveService, AdminNotification} from "../services/announcements/announcement-save.service"
import { AuthService } from "../services/auth/auth.service"
import { LoadingController } from '@ionic/angular';
import { GuestAddService } from "../services/guest-add/guest-add.service"
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { async } from 'q';
@Injectable({
    providedIn: 'root'
})
export class ActionClass implements OnInit { 
  currentUser :string;  
  loaderToShow: any;

  constructor(
    private imageService : ImagesService,
    private authServ : AuthService,
    private actionSheetController : ActionSheetController,
    private alertController : AlertController,   
    private socialSharing: SocialSharing,
    private toaster : ToastService,
    private modalCtrl : ModalController,
    private loadingController: LoadingController,
    private guestService : GuestAddService,
    private announcements : AnnouncementSaveService
  ) { }

  ngOnInit() {      

  }
  async DeleteConfirm(post) {
    const alert = await this.alertController.create({
      header: 'Are You Sure?',
      message: 'This Photo will be deleted',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           console.log("canceled")
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.imageService.removeImageRef(post,"image").then(async()=>{
                this.toaster.showToast("Photo Deleted")
                await this.modalCtrl.dismiss();
            })
          }
        }
      ]
    });
    await alert.present();
  }
  async GalleryActionSheet(post) {
    
    console.log(post)
    const {id,uploaded_by} = post
    var buttons = [
      {
        text: 'Share',
        icon: 'share',
        handler: () => {
          this.sharingActionSheet(post)
          console.log('Play clicked');
        }      
      },      
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.DeleteConfirm(post)
          
        }
      },{
        text: 'Cancel',
        icon: 'close',   
        handler: () => {
          
          console.log('Cancel clicked');
        }
      }
    ]  
    if(this.authServ.currentUserId() !== uploaded_by){          
      buttons.splice(1,1)
    }
    const actionSheet = await this.actionSheetController.create({
      buttons: buttons
    });
 
    await actionSheet.present();
  }
  async sharingActionSheet(post) {
    const {id ,url} = post    
    this.showLoader()
    await this.imageService.downloadImage(url).then(async(ImgFile)=>{
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 500);
      const actionSheet = await this.actionSheetController.create({  
        buttons: [
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {  
            this.shareToFacebook(ImgFile,url)
            console.log('Play clicked');
          }      
        },      
        {
          text: 'Twitter',     
          icon: 'logo-twitter',
          handler: () => {
              this.shareToTwitter(ImgFile,url)
            console.log('Delete clicked');
          }
        }, {
          text: 'Instagram',     
          icon: 'logo-instagram',
          handler: () => {
              this.shareToInsta(ImgFile,url)
            console.log('Delete clicked');
          }
        },{
          text: 'WhatsApp',     
          icon: 'logo-whatsapp',
          handler: () => {
              this.shareToWhatsApp(ImgFile,url)
            console.log('Delete clicked');
          }
        },{
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      });
   
      await actionSheet.present();
    })
    // const ImgFile = await this.imageService.downloadImage(url)

  }
  async DirectSharingButton(post,type){
    const {id ,url} = post    
    this.showLoader()
    await this.imageService.downloadImage(url).then(async(ImgFile)=>{
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 500);
      switch(type){
        case "fb":
            this.shareToFacebook(ImgFile,url)
            console.log("fb")
        break
        case "twitter":
            this.shareToTwitter(ImgFile,url)
            console.log("tw")
        break
        case "insta":
            this.shareToInsta(ImgFile,url)
            console.log("ins")
        break
        case "whats":
            this.shareToWhatsApp(ImgFile,url)
            console.log("wts")
        break
      }      
    })
  }
  async confirmationMessage(message:string,notifBody?:string,header?:string):Promise<boolean> {
    let choice
    const alert = await this.alertController.create({
      header: header||'Are You Sure?',
      subHeader :notifBody||"",
      message: message,      
      buttons: [
       {
          text: 'Cancel',
          handler: () => {
          alert.dismiss(false)
          return false
          }
        }, {
          text: 'Yes',
          handler: () => {
          alert.dismiss(true)
          return false
          }
        }
      ]
    })  
     await alert.present();
     await alert.onDidDismiss().then(res=>{
      choice = res.data
     })
     return choice
  }
  async eventActionSheet():Promise<any>{ 
    let choice
    var buttons = [        
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {          
        }
      },{
        text: 'Cancel',
        icon: 'close',   
        handler: () => {          
          console.log('Cancel clicked');
        }
      }
    ]       
    const options = await this.actionSheetController.create({
      buttons: buttons
    });
    await options.present();
    await options.onDidDismiss().then(res=>{   
     choice = res.role
    })
    return choice
  }
  async inputAlert (){
    const alert = await this.alertController.create({
      header: "Warning",
      message: "Please Complete All Fields",
      buttons: ["OK"]
    });
    await alert.present();
  }
  async customAlert (header,message){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"]
    });
    await alert.present();
  }
  shareToFacebook(ImageFile,url){
    this.socialSharing.shareViaFacebook(null, ImageFile, url).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("Can't find Facebook App In your Device")
    });
  }
  shareToInsta(ImageFile,url){
    this.socialSharing.shareViaInstagram(null, ImageFile).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("Can't find Instagram App In your Device")
    });
  }
  shareToWhatsApp(ImageFile,url){
    this.socialSharing.shareViaWhatsApp(null, ImageFile, url).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("Can't find WhatsApp In your Device")
    });
  }
  shareToTwitter(ImageFile,url){
    this.socialSharing.shareViaTwitter(null, ImageFile, url).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("Can't find Twitter In your Device")
    });
  }
  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();      
    });
 
  }
  async plusOnePrompt():Promise<any>{
    var returning_data
    let alert = await this.alertController.create({
      header: 'Plus One',
      inputs: [
        {
          name: 'extra',
          placeholder: 'Extra Guests Count',
          type: "number"
        },       
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },{
          text: 'Save',
          handler:  data => {
            console.log(data)
            if (data.extra !== "0" && data.extra !== "") {
              // logged in!
              this.customAlert(`Alright!`,`This number (${data.extra}) is now your Plus Guests Count, Click Plus Guest On Side Menu if You want to Change it.`)
            } else {              
              this.toaster.showToast("Guest Number Cannot be Empty")
              this.plusOnePrompt()
            }
          }
        }   
      ]
    });
   await alert.present();
   await alert.onDidDismiss().then(res=>{
    returning_data = res.data
   })
   return returning_data
  }
  async busReservationPropmpt():Promise<any>{
    var returning_data,confirmation
    let alert = await this.alertController.create({
      header: 'Bus Reservation',
      message: 'Please Enter the Number of Seat You want to Reserve',
      inputs: [
        {
          name: 'count',
          placeholder: 'Number of Seats',
          type: "number"
        },       
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },{
          text: 'Enter',
          handler: async data => {
            console.log(data)
            if (data.count !== "0" && data.count !== "") {
              // logged in!
              var userDetails = this.authServ.userGuestDetails,
                {first_name,last_name,uid } = userDetails

              confirmation = await this.confirmationMessage(`This Reservation of (${data.count}) seat/s will be under your Name "${first_name} ${last_name}"`).then(message =>{
                if(message){     
                  var count = parseInt(data.count)
                  this.guestService.updateBusReservation(uid,count).then(()=>{
                    let notif : AdminNotification ={
                      title: "Bus Reservation",
                      body: `${first_name} ${last_name} want to reserve (${count}) seat/s in the Bus`,
                      createdAt : Date.now(),
                      status : "unread",
                      focus : data.count,
                      guest : `${first_name} ${last_name}`,
                      guest_uid : uid 
                  }                
                    this.announcements.saveNotif(notif).then(()=>{
                      this.customAlert(`Alrighty!`,`This Seat Reservation Count of (${data.count}) will be sent to the Event Planner to Review and Confirm your Reservation,
                      Wait for an Email Confirmation of your Request`)
                    })               
                  })                              
                }else{

                }
              })

            } else {              
              this.toaster.showToast("Reservation Count Cannot be Empty")
              this.busReservationPropmpt ()
            }
          }
        }   
      ]
    });
   await alert.present();   
   await alert.onDidDismiss().then(res=>{
    returning_data = res.data
   })
   return returning_data
  }
  async DietPrompt():Promise<any>{
    var returning_data,confirmation
    let alert = await this.alertController.create({
      header: 'Diet Restriction',
      message: 'Please Provide Your Dietary Restriction',
      inputs: [
        {
          name: 'restrict',
          placeholder: 'Tell us about your Diet Restrictions',
          type: "text"
        },       
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },{
          text: 'Enter',
          handler: async data => {
            console.log(data)
            if (data.restrict !== "") {
              // logged in!
              var userDetails = this.authServ.userGuestDetails,
                {first_name,last_name,uid } = userDetails

              confirmation = await this.confirmationMessage(`This Diet Restriction of "(${data.restrict})" will be sent to the Event Planner.`).then(message =>{
                if(message){                       
                  this.guestService.updateDietaryRestriction(uid,data.restrict).then(()=>{
                    let notif : AdminNotification ={
                      title: "Diet Restriction",
                      body: `${first_name} ${last_name} noted that "${data.restric}" for his/her meal`,
                      createdAt : Date.now(),
                      status : "unread",
                      focus : data.restrict,
                      guest : `${first_name} ${last_name}`,
                      guest_uid : uid 
                    }                
                    this.announcements.saveNotif(notif).then(()=>{
                      this.customAlert(`Alrighty!`,`We will notify the Event Planner with this Dietary Restriction "${data.restrict}" to provide a meal that will meet your dietary needs."`)
                    })               
                  })                              
                }else{

                }
              })

            } else {              
              this.toaster.showToast("Reservation Count Cannot be Empty")
              this.busReservationPropmpt ()
            }
          }
        }   
      ]
    });
   await alert.present();   
   await alert.onDidDismiss().then(res=>{
    returning_data = res.data
   })
   return returning_data
  }
  // imageUploadTest(){
  //   // var image = this.webview.convertFileSrc("../../assets/images/g1.jpg");
  //   var image = "../../assets/images/g4.jpg";
  //   //uploads img to firebase storage
  //   this.imageService.saveImageRef(image).then(photoURL => {    
  //       this.toaster.showToast("image uploaded")
  //   })
    
  // }
}
