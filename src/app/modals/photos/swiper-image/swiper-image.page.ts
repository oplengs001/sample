import { Component,Injectable, OnInit,ViewChildren, ElementRef, ViewChild, QueryList } from '@angular/core';
import { ModalController,IonSlides, IonContent } from '@ionic/angular';
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
  @ViewChild(IonContent, {static: false}) ioncontent: IonContent;
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
          on: {
            beforeInit() {
              const swiper = this;
              swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
              const overwriteParams = {
                slidesPerView: 1,
                slidesPerColumn: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: true,
                spaceBetween: 0,
                virtualTranslate: true,
              };
              swiper.params = Object.assign(swiper.params, overwriteParams);
              swiper.params = Object.assign(swiper.originalParams, overwriteParams);
            },
            setTranslate() {
              const swiper = this;
              const { slides } = swiper;
              for (let i = 0; i < slides.length; i += 1) {
                const $slideEl = swiper.slides.eq(i);
                const offset$$1 = $slideEl[0].swiperSlideOffset;
                let tx = -offset$$1;
                if (!swiper.params.virtualTranslate) tx -= swiper.translate;
                let ty = 0;
                if (!swiper.isHorizontal()) {
                  ty = tx;
                  tx = 0;
                }
                const slideOpacity = swiper.params.fadeEffect.crossFade
                  ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
                  : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
                $slideEl
                  .css({
                    opacity: slideOpacity,
                  })
                  .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
              }
            },
            setTransition(duration) {
              const swiper = this;
              const { slides, $wrapperEl } = swiper;
              slides.transition(duration);
              if (swiper.params.virtualTranslate && duration !== 0) {
                let eventTriggered = false;
                slides.transitionEnd(() => {
                  if (eventTriggered) return;
                  if (!swiper || swiper.destroyed) return;
                  eventTriggered = true;
                  swiper.animating = false;
                  const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
                  for (let i = 0; i < triggerEvents.length; i += 1) {
                    $wrapperEl.trigger(triggerEvents[i]);
                  }
                });
              }
            },
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
  // this.ioncontent.forceOverscroll = true
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
  imageLoaded(event,isLoaded: boolean) {    
    if (isLoaded) {
      // setTimeout(() => {        
        
        event.target.parentElement.classList.add('img-loaded');
      // }, 500);
    } else {
        event.target.parentElement.classList.remove('img-loaded');
    }
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
