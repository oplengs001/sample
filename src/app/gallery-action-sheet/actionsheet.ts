import { OnInit,Injectable} from '@angular/core';
import { ActionSheetController ,AlertController} from '@ionic/angular';
 
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { AuthService } from "../services/auth/auth.service"
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Injectable({
    providedIn: 'root'
})
export class ActionClass implements OnInit { 
  currentUser :string;  
  constructor(
    private imageService : ImagesService,
    private authServ : AuthService,
    private actionSheetController : ActionSheetController,
    private alertController : AlertController,   
    private socialSharing: SocialSharing
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
            this.imageService.removeImageRef(post)
          }
        }
      ]
    });
    await alert.present();
  }
  async presentActionSheet(post) {
    
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
    const ImgFile = await this.imageService.downloadImage(url)
    debugger
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
  }
  async confirmationMessage(message:string):Promise<boolean> {
    let choice
    const alert = await this.alertController.create({
      header: 'Are You Sure?',
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
        text: 'Edit',
        icon: 'create',
        role: 'edit',
        handler: () => {      
        }      
      },      
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
      alert("wait")
    });
  }
  shareToInsta(ImageFile,url){
    this.socialSharing.shareViaInstagram(null, ImageFile).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("wait")
    });
  }
  shareToWhatsApp(ImageFile,url){
    this.socialSharing.shareViaWhatsApp(null, ImageFile, url).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("wait")
    });
  }
  shareToTwitter(ImageFile,url){
    this.socialSharing.shareViaTwitter(null, ImageFile, url).then((res) => {
      // Success
    }).catch((e) => {
      console.log(e)
      alert("wait")
    });
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
