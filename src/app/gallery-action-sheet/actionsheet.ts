import { OnInit,Injectable} from '@angular/core';
import { ActionSheetController ,AlertController, Platform} from '@ionic/angular';
import { ModalController, } from '@ionic/angular';
import { ToastService } from '../services/toaster/toast-service';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { AnnouncementSaveService, AdminNotification} from "../services/announcements/announcement-save.service"
import { AuthService } from "../services/auth/auth.service"
import { LoadingController } from '@ionic/angular';
import { GuestAddService } from "../services/guest-add/guest-add.service"
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { async } from 'q';
import { NotificationService } from '../services/alerts/notification.service';
import { HTTP ,HTTPResponse} from '@ionic-native/http/ngx';

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
    private announcements : AnnouncementSaveService,
    private notifService : NotificationService,
    private platform : Platform,
    public httpIon : HTTP
  ) { }

  ngOnInit() {      

  }
  async DeleteConfirm(post,type:string) {
    var images
    console.log(type)
    if(type==="post"){
     images = post.images
      
    }else{
      images = [post]
    }
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'This will be deleted',
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
            
            for(var i in images){
                var image = images[i]
                this.imageService.removeImageRef(image,"image",type).then(async()=>{
                  this.toaster.showToast("Photo Deleted")
                  await this.modalCtrl.dismiss();
              })
            }
           
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
          this.generalPostShare(post)
          console.log('Play clicked');
        }      
      },      
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.DeleteConfirm(post,"post")
          
        }
      },{
        text: 'Cancel',
        icon: 'close',   
        handler: () => {
          
          console.log('Cancel clicked');
        }
      }
    ]  
   
    if(!this.authServ.isAdmin()){
      if(this.authServ.currentUserId() !== uploaded_by){
        buttons.splice(1,1)
      }
    }
    const actionSheet = await this.actionSheetController.create({
      buttons: buttons
    });
 
    await actionSheet.present();
  }

  async sharingActionSheet(post) {
    const {id,images} = post    
    this.showLoader()
    let array = [];
    for (var _i = 0; _i < images.length; _i++) {
      var url = images[_i].url;
      var file_name = images[_i].file_name;
      await this.imageService.downloadImageMultiple(url,file_name)
      .then(async ImgFile => {
        console.log('RESULT:', ImgFile)
        array.push(ImgFile)
      })
    }
    setTimeout(() => {
      this.loadingController.dismiss();
      console.log(array)
    }, 500);
      const actionSheet = await this.actionSheetController.create({  
        buttons: [
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {  
            this.shareToFacebook(array,null)
            console.log('Play clicked');
          }      
        },      
        {
          text: 'Twitter',     
          icon: 'logo-twitter',
          handler: () => {
              this.shareToTwitter(array,null)      
          }
        }, {
          text: 'Instagram',     
          icon: 'logo-instagram',
          handler: () => {
              this.shareToInsta(array,null)      
          }
        },{
          text: 'WhatsApp',     
          icon: 'logo-whatsapp',
          handler: () => {
              this.shareToWhatsApp(array,null)      
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
  
    // const ImgFile = await this.imageService.downloadImage(url)

  }
  async generalPostShare(post) {
    var images
    if(post.images){
       images = post.images
    }else{
      images = [post]
    }
    this.showLoader()
    let array = [];
    for (var _i = 0; _i < images.length; _i++) {
      var url = images[_i].url;
      var file_name = images[_i].file_name;
      await this.imageService.downloadImageMultiple(url,file_name)
      .then(async ImgFile => {
        console.log('RESULT:', ImgFile)
        array.push(ImgFile)
      })
    }
    setTimeout(() => {
      this.loadingController.dismiss();
      console.log(array)
    }, 500);
    this.generalShare(array,null)
  
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
            this.shareToFacebook(ImgFile,null)
            console.log("fb")
        break
        case "twitter":
            this.shareToTwitter(ImgFile,null)
            console.log("tw")
        break
        case "insta":
            this.shareToInsta(ImgFile,null)
            console.log("ins")
        break
        case "whats":
            this.shareToWhatsApp(ImgFile,null)
            console.log("wts")
        break
      }      
    })
  }
  async confirmationMessage(message:string,notifBody?:string,header?:string):Promise<boolean> {
    let choice
    const alert = await this.alertController.create({
      header: header||'Are you sure?',
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
  generalShare(ImageFile,url){
    this.socialSharing.share(null,null, ImageFile).then((res) => {
      // Success
    }).catch((e) => {
      this.loadingController.dismiss();
      console.log(e)
      alert(e)
    });
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
    if(this.platform.is("ios")){
      this.socialSharing.shareViaFacebook(null, ImageFile, url).then((res) => {
        // Success
      }).catch((e) => {
        console.log(e)
        alert(e)
      });
    }else{
      this.socialSharing.share(null,null, ImageFile).then((res) => {
        // Success
      }).catch((e) => {
        console.log(e)
        alert(e)
      });
    }
  }
  shareToInsta(ImageFile,url){
    if(this.platform.is("ios")){
      this.socialSharing.share(null,null, ImageFile).then((res) => {
        // Success
      }).catch((e) => {
        console.log(e)
        alert(e)
      });
    }else{
      this.socialSharing.shareViaInstagram(null, ImageFile).then((res) => {
        // Success
      }).catch((e) => {
        console.log(e)
        alert(e)
      });
    }
   
  }
  shareToWhatsApp(ImageFile,url){
    this.socialSharing.shareViaWhatsApp(null, ImageFile, url).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("e")
    });
  }
  shareToTwitter(ImageFile,url){
      this.socialSharing.shareViaTwitter(null, ImageFile, url).then((res) => {
        // Success
      }).catch((e) => {
        console.log(e)
        if(e==="not available"){
          alert("image shared")
        }else{
          alert(e)
        }
      });
    
  }
  async downloadToPhone(post){
    this.showLoader()
    if(this.platform.is("android")){
      await this.imageService.downloadtoDirectory(post.url,post.file_name)
      .then(imgFile=>{
        this.toaster.showToast("Image saved to gallery")
      }).catch(e=>{
        alert(e)
      })
    }else{
      await this.imageService.downloadImageMultiple(post.url,post.file_name)
        .then(async ImgFile => {
        
            this.socialSharing.saveToPhotoAlbum(ImgFile).then((res)=>{
              this.toaster.showToast("Image saved to gallery")
              setTimeout(() => {
                this.loadingController.dismiss();
              }, 500);
              }).catch((e) => {
                console.log(e)
                this.loadingController.dismiss();
                if(e==="not available"){
                  
                }else{
                  this.toaster.showToast("Download not avaiable on your device please use the share button for now")
                }
            });
          }
        )
    }
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
  async busReservationPropmpt(count?:number,resend?:boolean):Promise<any>{
    var returning_data,confirmation
    var message =""
    if(resend){
      message = `Note:You already have ${count} reservation, submitting new seat count will set your approved request to pending`
    }else{
      message = "Please Enter the number of seat you want to reserve"
    }
    let alert = await this.alertController.create({
      header: 'Bus Reservation',
      message: message,
      inputs: [
        {
          name: 'count',
          placeholder: 'Number of Seats',
          type: 'number',
          value: count,
          min: 1,
          max: 10
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
              // logged in!'
              if(data.count >11 ){                
                this.toaster.showToast("Your only allowed to reserved (10 seats).")
                this.busReservationPropmpt()
                return
              }  
              if(data.count <=0 ){         
                this.toaster.showToast("Enter a valid seat number.")
                this.busReservationPropmpt()
                return
              }
              if(data.count % 1 != 0 ){         
                this.toaster.showToast("Enter a valid seat number.")
                this.busReservationPropmpt()
                return
              }
              var userDetails = this.authServ.userGuestDetails,
                {first_name,last_name,uid } = userDetails

              confirmation = await this.confirmationMessage(`This reservation of (${data.count}) seat/s will be under your Name "${first_name} ${last_name}".`).then(message =>{
                if(message){     
                  var count = parseInt(data.count)
                  this.guestService.updateBusReservation(uid,count).then(()=>{
                    let notif : AdminNotification ={
                      title: "Bus Reservation",
                      body: `${first_name} ${last_name} want to reserve (${count}) seat/s in the Bus.`,
                      createdAt : Date.now(),
                      status : "unread",
                      focus : data.count,
                      guest : `${first_name} ${last_name}`,
                      guest_uid : uid 
                  }                
                    this.announcements.saveNotif(notif).then(()=>{
                      this.notifService.AdminNotif('Bus Reservation',`${first_name} ${last_name} want to reserve (${count}) seat/s in the Bus.`)
                      this.customAlert(`Alrighty!`,`This Seat Reservation Count of (${data.count}) will be sent to the Event Planner to review and confirm your reservation,
                      wait for an Email confirmation of your request.`)

                    })               
                  })                              
                }else{

                }
              })

            } else {              
              this.toaster.showToast("Reservation count cannot be Empty")
              this.busReservationPropmpt()
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
  async DietPrompt(restrict):Promise<any>{
    var returning_data,confirmation
    let alert = await this.alertController.create({
      header: 'Diet Restriction',
      message: 'Please Provide Your Dietary Restriction',
      inputs: [
        {
          name: 'restrict',
          placeholder: 'Tell us about your Diet Restrictions',
          type: "text",
          value: restrict
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
                      body: `${first_name} ${last_name} noted that "${data.restrict}" for his/her meal`,
                      createdAt : Date.now(),
                      status : "unread",
                      focus : data.restrict,
                      guest : `${first_name} ${last_name}`,
                      guest_uid : uid 
                    }                
                    this.announcements.saveNotif(notif).then(()=>{
                      this.customAlert(`Alrighty!`,`We will notify the Event Planner with this Dietary Restriction "${data.restrict}" to provide a meal that will meet your dietary needs."`)
                      this.notifService.ConfirmationEmail(uid,"diet")
                    })
                  })                              
                }else{

                }
              })

            } else {              
              this.toaster.showToast("Diet Restriction cannot be empty.")
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
  async reserveReasonPrompt(uid:string):Promise<any>{
    
    var returning_data
    let alert = await this.alertController.create({
      header: 'Rejecting Reason',
      message: 'Please Provide your reason for rejecting this reservation, (this will be included in the email that the guest will received)',
      inputs: [
        {
          name: 'reason',          
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
            if (data.reason !== "") {
              // logged in!
              this.guestService.updateBusReservationStatus(uid,"declined").then(()=>{      
                this.notifService.ConfirmationEmail(uid,"reservation","declined",data.reason)
                
              })      
            } else {              
              this.toaster.showToast("Reason Cannot be Empty")
              this.reserveReasonPrompt(uid)
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
  async forgotPassword():Promise<any>{
    let alert = await this.alertController.create({
      header: 'Hello',
      message: 'Please enter your email so we can send a reset password email for you',
      inputs: [
        {
          name: 'email',          
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
          handler: async rer => {
            
            this.authServ.resetPassword( rer.email ).then( data=>{
                this.customAlert("Success!",`Check your email "${rer.email}" to reset your password!`)
              }
            ).catch(e =>{
              console.log(e)
            })
          }
        }   
      ]
    });
    await alert.present();
  }
  async reserveConfirmPrompt(user_id:string):Promise<any>{     
    let choice
    var buttons = [        
      {
        text: 'Approve',    
        icon: 'checkmark-circle',      
        handler: () => {       
          this.guestService.updateBusReservationStatus(user_id,"approved").then(data=>{
            this.notifService.ConfirmationEmail(user_id,"reservation","approved")
            // this.customAlert(`Alrighty!`,`We will notify the Event Planner with this Dietary Restriction "${data.restrict}" to provide a meal that will meet your dietary needs."`)
          })
        }
      },
      {
        text: 'Decline',    
        icon: 'close-circle',    
        handler: () => {
          this.reserveReasonPrompt(user_id)
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


  // imageUploadTest(){
  //   // var image = this.webview.convertFileSrc("../../assets/images/g1.jpg");
  //   var image = "../../assets/images/g4.jpg";
  //   //uploads img to firebase storage
  //   this.imageService.saveImageRef(image).then(photoURL => {    
  //       this.toaster.showToast("image uploaded")
  //   })
    
  // }
}
