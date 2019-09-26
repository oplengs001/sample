import { Component, OnInit } from '@angular/core';
import { ActionSheetController} from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ImagesService } from "../services/uploads/images.service"
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ToastService } from '../services/toaster/toast-service';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  galleryType = 'regular';
  constructor(
    private imagePicker : ImagePicker,
    private imageService : ImagesService,
    private toaster : ToastService,
    private webview : WebView
  ) { }

  ngOnInit() {
    this.imageService.getFiles()
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
    
      //uploads img to firebase storage
      this.imageService.uploadImage(image)
      .then(photoURL => {    
        this.toaster.showToast("image uploaded")
        })
      }
}
