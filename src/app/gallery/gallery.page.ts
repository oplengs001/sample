import { Component, OnInit ,ViewChild ,ElementRef} from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { AuthService } from "../services/auth/auth.service"
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ToastService } from '../services/toaster/toast-service';
import { Observable } from 'rxjs';
import { TransitionsService } from '../services/native/transitions.service';
import { ImagePage } from '../modals/photos/image/image.page'
import { ActionClass} from '../gallery-action-sheet/actionsheet'
import { LoadingController, IonInfiniteScroll } from '@ionic/angular';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  private GalleryPosts: Observable<ImageItem[]>;
  fileUploads: any[];
  galleryType = 'regular';
  imagePath : string;
  currentUser :string; 
  OwnImages: boolean;
  images_length : number;

  image_limit : number
  constructor(
    private imagePicker : ImagePicker,
    private imageService : ImagesService,
    private toaster : ToastService,
    private authServ : AuthService,
    private webview : WebView,
    private transServe : TransitionsService,
    private imageModal: ImagePage,
    private loadingCtrl : LoadingController,
    private actions : ActionClass ,
    private _elementRef: ElementRef,  
    
  ) { } 
  imageLoaded(event,isLoaded: boolean) {    
    if (isLoaded) {    
      setTimeout(() => {        
        event.target.parentElement.classList.add('img-loaded');
      }, 500);
    } else {
        event.target.parentElement.classList.remove('img-loaded');
    }
  }
  ngOnInit() {       
   const source = this.imageService.getReferences();
  //  this.GalleryPosts = this.imageService.joinUsers(source);
  this.image_limit = 12
  this.imageService.joinUsers(source).then(data=>{ 
    data.subscribe( data=>{
      console.log(data)
      this.images_length = data.length
      this.GalleryPosts = data
    })
  });  
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
      this.toaster.showToast("Image will be uploaded soon") 
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
  loadData(event) {      
    setTimeout(() => {         

      if(this.images_length !== undefined){                    
          this.image_limit = this.image_limit + 12
          if ( this.image_limit >= this.images_length) {          
            this.infiniteScroll.disabled = true            
            this.image_limit = this.images_length
          }else{                             
            this.infiniteScroll.complete() 
          }                 
      }else{
        this.infiniteScroll.complete()
      }           
    }, 400);
  }
}
