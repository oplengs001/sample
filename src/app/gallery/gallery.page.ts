import { Component, OnInit ,ViewChild ,ElementRef} from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { AuthService } from "../services/auth/auth.service"
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ToastService } from '../services/toaster/toast-service';
import { Observable } from 'rxjs';
import { TransitionsService } from '../services/native/transitions.service';
import { ImagePage } from '../modals/photos/image/image.page'
import { GalleryPostPage } from '../modals/gallery-post/gallery-post.page'
import { ActionClass} from '../gallery-action-sheet/actionsheet'
import { LoadingController, IonInfiniteScroll } from '@ionic/angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SharedComponent } from '../shared-component/shared';
import { AnnouncementSaveService } from '../services/announcements/announcement-save.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  // private GalleryPosts: Observable<ImageItem[]>;

  fileUploads: any[];
  galleryType = 'regular';
  imagePath : string;
  currentUser :string; 
  all_images : any[]
  OwnImages: boolean;
  images_length : number;
  private currentPostID : string

  image_limit : number
  constructor(
    private imagePicker : ImagePicker,
    private imageService : ImagesService,
    private toaster : ToastService,
    private authServ : AuthService,
    private webview : WebView,
    private transServe : TransitionsService,
    private imageModal: ImagePage,
    private postModal : GalleryPostPage,
    private loadingCtrl : LoadingController,
    private actions : ActionClass ,
    private _elementRef: ElementRef,  
    private imageCompress: NgxImageCompressService,
    private sharedComps : SharedComponent,
    private annServe : AnnouncementSaveService
    
  ) { } 
  imageLoaded(event,isLoaded: boolean) {    
    if (isLoaded) {
      // setTimeout(() => {        
        
        event.target.parentElement.classList.add('img-loaded');
      // }, 500);
    } else {
        event.target.parentElement.classList.remove('img-loaded');
    }
  }
  customImageLoaded(event,isLoaded: boolean) {    
    if (isLoaded) {
      // setTimeout(() => {                
        event.target.parentElement.parentElement.classList.add('img-loaded');
      // }, 500);      
    } else {
        event.target.parentElement.parentElement.classList.remove('img-loaded');
    }
  }
  ngOnInit() {       
   const source = this.imageService.getReferences();
  //  this.GalleryPosts = this.imageService.joinUsers(source);
    
    this.imageService.joinUsers(source).then(data=>{ 
      data.subscribe( data=>{
        this.imageService.GalleryPosts = []
        this.all_images = data
        this.images_length = data.length
        // this.GalleryPosts = data
        var groupi = this.groupBy('post_id')
        var posts = groupi(data)
        for (var key of Object.keys(posts)) {
          this.imageService.GalleryPosts.push({
                post_id : key,
                images : posts[key],
                date_uploaded : posts[key][0]['date_uploaded'],
                uploaded_by : posts[key][0]['uploaded_by'],
                user : posts[key][0]['user']
            })
        }
        this.imageService.getByPostID(this.currentPostID)
     
      })
    });
 
    this.currentUser = this.authServ.currentUserId();
  }
  groupBy = key => array =>
      array.reduce((objectsByKeyValue, obj) => {     
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);   
          return objectsByKeyValue;
      }, []);


  

  openImagePicker(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission().then(data=>{
              this.openImagePicker()
          });
          // this.imagePicker.requestReadPermission()
        }
        else if(result == true){
          this.imagePicker.getPictures({
            disable_popover : true,
            maximumImagesCount: 15,
            quality : 80,
            
          }).then(
            (results) => {
                this.uploadImageToFirebase(results);
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }
  async uploadImageToFirebase(images){
    this.uploader(images).then(res=>{
      if(res.length>0){
        this.toaster.showToast("Images will be uploaded soon")
        this.toaster.showToast("image uploaded")
      }
    })
  }
  async uploader(images):Promise<any>{ 
    var post_id = this.imageService.makeid(10)
    for(var i in images){
        var image = this.webview.convertFileSrc(images[i]);   
        await this.imageCompress.compressFile(image,-1,50,35).then(res=>{
          this.imageService.saveImageRef(res,post_id).then(photoURL => {    
            console.log(photoURL)
          })
        })
    }
    return images
  }
  trackByCreated(i, post) {
    return post.date_uploaded;
  }
  imageClick(post){
    this.imageModal.openImageModal(
      post,
      false,
      this.currentUser,
      false
    )
  }
  seeMoreClick(post){
    var {post_id} = post
    this.currentPostID = post_id
    this.imageService.getByPostID(this.currentPostID)
    this.postModal.openModal(post_id)
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
            // this.infiniteScroll.disabled = true            
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
