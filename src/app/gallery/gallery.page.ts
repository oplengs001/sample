import { Component, OnInit } from '@angular/core';
import { ActionSheetController} from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ToastService } from '../services/toaster/toast-service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  private posts: Observable<ImageItem[]>;
  fileUploads: any[];
  galleryType = 'regular';
  imagePath : string
  constructor(
    private imagePicker : ImagePicker,
    private imageService : ImagesService,
    private toaster : ToastService,
    private webview : WebView
  ) { }

  ngOnInit() {      
   const source = this.imageService.getReferences();
   
   this.posts = this.imageService.joinUsers(source);

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
  imageUploadTest(){
    // var image = this.webview.convertFileSrc("../../assets/images/g1.jpg");
    var image = "../../assets/images/g1.jpg";
    //uploads img to firebase storage
    this.imageService.saveImageRef(image).then(photoURL => {    
        this.toaster.showToast("image uploaded")
    })
    
  }
}
