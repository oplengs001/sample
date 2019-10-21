import { OnInit,Injectable} from '@angular/core';
import { ActionSheetController} from '@ionic/angular';

import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { AuthService } from "../services/auth/auth.service"
import { AlertController } from '@ionic/angular';
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
    const {id} = post
    const actionSheet = await this.actionSheetController.create({  
      buttons: [
      {
        text: 'Facebook',
        icon: 'logo-facebook',
        handler: () => {  
          console.log('Play clicked');
        }      
      },      
      {
        text: 'Twitter',     
        icon: 'logo-twitter',
        handler: () => {
          console.log(id)
          console.log('Delete clicked');
        }
      }, {
        text: 'Instagram',     
        icon: 'logo-instagram',
        handler: () => {
          console.log(id)
          console.log('Delete clicked');
        }
      },{
        text: 'WhatsApp',     
        icon: 'logo-whatsapp',
        handler: () => {
          console.log(id)
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


  
  // imageUploadTest(){
  //   // var image = this.webview.convertFileSrc("../../assets/images/g1.jpg");
  //   var image = "../../assets/images/g4.jpg";
  //   //uploads img to firebase storage
  //   this.imageService.saveImageRef(image).then(photoURL => {    
  //       this.toaster.showToast("image uploaded")
  //   })
    
  // }
}
