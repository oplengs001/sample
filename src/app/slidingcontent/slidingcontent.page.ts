import { Component, OnInit ,ViewChild } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
import { ActivatedRoute } from '@angular/router';
import { IonReorderGroup, LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service'
import { ActionClass} from '../gallery-action-sheet/actionsheet'
import { ModalController, IonContent } from '@ionic/angular';
import { CreateEventPage } from '../modals/create-event/create-event.page';
import { ViewingcontentPage } from '../viewingcontent/viewingcontent.page'
import { SlidingContentService, Itinerary } from "../services/content/sliding-content.service"
import { GeneralInfoService ,Info} from "../services/content/general-info.service"
import { GettingTherePage } from "../modals/getting-there/getting-there.page"
import { BusReservationsPage } from "../modals/bus-reservations/bus-reservations.page"
import { FooterComponent } from '../footer/footer.component';
import { SharedComponent } from '../shared-component/shared';
import { ImagesService } from '../services/uploads/images.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AnnouncementSaveService } from '../services/announcements/announcement-save.service';

@Component({
  selector: 'app-slidingcontent',
  templateUrl: './slidingcontent.page.html',
  styleUrls: ['./slidingcontent.page.scss'],
})
export class SlidingcontentPage implements OnInit {  
  @ViewChild(IonContent, {static: false}) ioncontent: IonContent;
  @ViewChild(IonReorderGroup, {static: false}) reorderGroup: IonReorderGroup;
  content :string
  topResto : any = []
  event_it : any = []
  Dining: boolean
  Itinerary :boolean
  isAdmin : boolean
  tba : boolean
  hideElements :boolean
  events: Observable<Itinerary[]>;
  event_data : any
  lastPosition : number
  info : any
  user_details : any
  private contentSubs : Subscription;
  constructor(
    private transServe : TransitionsService,
    private authServ : AuthService,
    private actions : ActionClass,
    private route : ActivatedRoute,
    private imageService : ImagesService,
    private imagePicker : ImagePicker,
    private contentServe : SlidingContentService,
    private modalController : ModalController,
    private generalInfo : GeneralInfoService,
    private sharedComps : SharedComponent,
    private annServe : AnnouncementSaveService,
    private webview : WebView,
    public loadingController: LoadingController,
    private imageCompress: NgxImageCompressService,
  ) {   
    this.Dining = false
    this.Itinerary = false   
  }
  doReorder(ev: any) {    
    var 
    {from,to} = ev.detail,
    fromData = this.event_data[from],
    toData = this.event_data[to],
    fromRef = fromData.ref,
    toRef = toData.ref;       
    this.contentServe.updateEventItem(fromRef,fromData,to)
    this.contentServe.updateEventItem(toRef,toData,from)
    ev.detail.complete();
  }
  toggleReorderGroup() {
    
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }
  ionViewDidEnter(){
   this.contentSubs = this.route.queryParams.subscribe(params => {
      this.content = params["content"];    
   
      if(this.content ==="Dining"){
        this.Dining = true
        this.Itinerary =false
      }else if(this.content === "Itinerary"){
        this.Dining =false
        this.Itinerary = true
      }               
    }); 
  }
  ionViewDidLeave(){
    this.contentSubs.unsubscribe()
  }
  async addEvent() {

    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: CreateEventPage,
          componentProps: {
            event_last_position : this.lastPosition,
            aParameter: true,
            otherParameter: new Date()
          }
    });          
    await modal.present();
  }
  async OpenDining(diningPlace) {    
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: ViewingcontentPage,
          componentProps: {
            view_content : diningPlace,
            aParameter: true,
            otherParameter: new Date()
          }
    });          
    await modal.present();
  }
  eventOptions(event){
    var {ref ,image_ref} = event
    this.actions.eventActionSheet().then(res=>{        
      console.log(res)
      if(res === "destructive"){     
          this.actions.confirmationMessage("Your About To Delete This Event").then(res=>{
            if(res){
              this.contentServe.deleteEventByRef(ref,image_ref).then(data=>{
                console.log("deleted")
              })
            }
          })
      }
    })
  }
  async openMap() {    
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: GettingTherePage,         
    });          
    await modal.present();
  }
 
  // async openReservations(){
  //   const modal: HTMLIonModalElement =
  //   await this.modalController.create({
  //      component: BusReservationsPage,         
  //   });          
  //   await modal.present();
  // }
  async openReservation(count?:number,resend?:boolean){
    if(count ===0){
      count = null
    }
    this.actions.busReservationPropmpt(count,resend).then(data=>{
      console.log(data)
      this.authServ.currentUserData().then(data=>{
        this.isAdmin = data.isAdmin
        this.user_details = data
      })
    })
  }
  async openRestrictions(restrict?:string){
    if(restrict === "none"){
      restrict = ""
    }
    this.actions.DietPrompt(restrict).then(data=>{

    })
  }
  ngOnInit() {    
    // this.isAdmin = this.authServ.isAdmin()
    this.tba = true
    this.hideElements = true
    this.authServ.currentUserData().then(data=>{
      this.isAdmin = data.isAdmin
      this.user_details = data
    })
    this.events = this.contentServe.getEvents()
    
    this.events.subscribe(data =>{
      console.log(data)      
      if(data.length > this.event_data){  
        this.tba = true
        this.hideElements = false
        this.ioncontent.scrollToBottom(1000);   
      }else{
        this.tba = false
        this.hideElements = true
      }
      this.event_data =  data.sort((a, b) => a.position - b.position)     
      
      this.lastPosition = this.event_data.length === 0? -1: this.event_data[this.event_data.length-1].position
      // this.event_data = this.addExpansion(this.event_data)
    })
    this.generalInfo.getWeddingInfoTakeOne().subscribe(data=>{      
      this.topResto = data[0].dining_list
    })
    this.generalInfo.getInfo().subscribe(data=>{
      if(data){
        console.log(data)
        this.info = data[0]//to be edit for more user
      }  
    })
    }
    saveItem(event){
      if(this.isAdmin){
        this.contentServe.updateEventDetails(event.ref,event)
      }else{
        console.log("none")
      }
      // 
    }
    saveItemWeddingInfo(){    
      this.generalInfo.updateInfo(this.info.ref,this.info)
    }
    expandItem(item): void {
      if (item.expanded) {
        item.expanded = false;
      } else {
        this.event_data.map(listItem => {
          if (item == listItem) {
            listItem.expanded = !listItem.expanded;
          } else {
            listItem.expanded = false;
          }
          return listItem;
        });
      }
    }
    openReception(){    
      var url = 'https://www.google.com/maps/search/?api=1&query=-45.033001,168.660799'
      window.open(url, '_system');
    }

    changeImage(){
      if(this.isAdmin){
          this.actions.confirmationMessage("your about to change to wedding image").then(res=>{
            if(res){
              this.openImagePicker()
            }else{
              return null
            }
          })
      }else{
        return null
      }
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
              maximumImagesCount: 1,
              quality: 80
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
    async uploadImageToFirebase(image){
      image = this.webview.convertFileSrc(image);       
      const loading = await this.loadingController.create({
        message: 'Saving Image',     
      });
      await loading.present();
      // var image = "/assets/images/Itinerary/arrival.jpg"    
      this.imageCompress.compressFile(image,-1,50,50).then(res=>{
        this.imageService.saveAppGalleryRef(res,"app-gallery").then(photo => {    
          this.info.wedding_image = photo.url           
          this.saveItemWeddingInfo()
          loading.dismiss()        
        })
      })
    
    }
}
