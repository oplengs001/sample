import { Component, OnInit } from '@angular/core';
import { ActionSheetController} from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { AuthService } from "../services/auth/auth.service"
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ToastService } from '../services/toaster/toast-service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { TransitionsService } from '../services/native/transitions.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  private GalleryPosts: Observable<ImageItem[]>;
  fileUploads: any[];
  galleryType = 'regular';
  imagePath : string;
  currentUser :string;  
  constructor(
    private imagePicker : ImagePicker,
    private imageService : ImagesService,
    private toaster : ToastService,
    private authServ : AuthService,
    private actionSheetController : ActionSheetController,
    private webview : WebView,
    private alertController : AlertController,
    private transServe : TransitionsService
  ) { }

  ngOnInit() {      
   const source = this.imageService.getReferences();
   this.GalleryPosts = this.imageService.joinUsers(source);
  }
  openImagePicker(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }
  uploadImageToFirebase(image){
    image =   this.webview.convertFileSrc(image);    
    this.imageService.saveImageRef(image).then(photoURL => {    
      this.toaster.showToast("image uploaded")
    })
  }
  trackByCreated(i, post) {
    return post.date_uploaded;
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
    if(this.currentUser !== uploaded_by){
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
