import { Component,Injectable, OnInit,ViewChildren, ElementRef, ViewChild, QueryList } from '@angular/core';
import { ModalController,IonSlides } from '@ionic/angular';
import { ActionClass } from 'src/app/gallery-action-sheet/actionsheet';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ImagesService } from 'src/app/services/uploads/images.service';

@Component({
  selector: 'app-swiper-image',
  templateUrl: './swiper-image.page.html',
  styleUrls: ['./swiper-image.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class SwiperImagePage implements OnInit {
  // @ViewChildren('mslides') slider:IonSlides;
  @ViewChild(IonSlides,{static:false}) slider:IonSlides;
  @ViewChildren('myPinchZoom') myPinchZoom : QueryList<any>;
  // @ViewChild(IonSlides, {static: false}) slider: IonSlides;
  image_post : any;
  hideFooter : boolean;
  hideDelete : boolean
  current_user : string
  isAdmin : boolean;
  slideOps : any;
  constructor(
    
    private modalctrl: ModalController,    
    private actions : ActionClass,
    private authServ : AuthService,
    private imageService : ImagesService
    ) { 
      this.slideOps =  {
        initialSlide: imageService.currentSelected_index,
        speed:400,

        zoom:{
          toggle:true,
          maxRatio: 3,
          minRatio: 2
        }
       
       }

    }
  dragEvent(item){
    if(this.slider){
      this.slider.getActiveIndex().then(data=>{
        if(this.myPinchZoom["_results"][data-1].isZoomedIn){
          this.myPinchZoom["_results"][data-1].toggleZoom()
        }
        if(this.myPinchZoom["_results"][data].isZoomedIn){
          this.myPinchZoom["_results"][data].toggleZoom()
        }
        if(this.myPinchZoom["_results"][data+1].isZoomedIn){
          this.myPinchZoom["_results"][data+1].toggleZoom()
        }
      })
    }
  

    // this.myPinchZoom.toggleZoom()
  }

  ngOnInit() {
   this.isAdmin = this.authServ.isAdmin()
  }
  swipeEvent(event){
    console.log(event)
  }
  async closeModal() {  
    await this.modalctrl.dismiss();
  }
  callThis(item){
    console.log(item)
  }
  async swiperModal(
    post:any,
    currentUser?:string,
    ) {
      this.isAdmin = this.authServ.isAdmin()
      // this.slider.slideTo(this.currentIndex)
      const modal: HTMLIonModalElement =
      await this.modalctrl.create({
         component: SwiperImagePage,
         componentProps:{
           image_post : post,
           current_user : currentUser,
         },
         cssClass:"customModalClass",
      });          
      await modal.present();  
  }
  trackByCreated(i, post) {
    return post.date_uploaded;
  }
}
