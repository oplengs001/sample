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
import { ImagePage } from '../modals/photos/image/image.page'
import { debug } from 'util';
import { ActionClass} from '../gallery-action-sheet/actionsheet'
import { LoadingController } from '@ionic/angular';
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
  OwnImages: boolean; 
  constructor(
    private imagePicker : ImagePicker,
    private imageService : ImagesService,
    private toaster : ToastService,
    private authServ : AuthService,
    private webview : WebView,
    private transServe : TransitionsService,
    private imageModal: ImagePage,
    private loadingCtrl : LoadingController,
    private actions : ActionClass
  ) { }

  ngOnInit() {      
   const source = this.imageService.getReferences();
   this.GalleryPosts = this.imageService.joinUsers(source);
   this.currentUser = this.authServ.currentUserId();
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
  imageClick(post){
    this.imageModal.openModal(post)
  }
  postFilter(){
    this.OwnImages = true
  }
  seeAll(){
    this.OwnImages = false
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
