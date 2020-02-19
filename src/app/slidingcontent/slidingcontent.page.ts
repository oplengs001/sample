import { Component, OnInit ,ViewChild } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
import { ActivatedRoute } from '@angular/router';
import { IonReorderGroup, LoadingController,IonTextarea } from '@ionic/angular';
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
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ToastService } from '../services/toaster/toast-service';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-slidingcontent',
  templateUrl: './slidingcontent.page.html',
  styleUrls: ['./slidingcontent.page.scss'],
})
export class SlidingcontentPage implements OnInit {  
  @ViewChild(IonContent, {static: false}) ioncontent: IonContent;
  @ViewChild(IonReorderGroup, {static: false}) reorderGroup: IonReorderGroup;
  @ViewChild(IonTextarea, {static:false}) ionTextarea: IonTextarea;
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
  divisions:any
  private contentSubs : Subscription;
  private eventSubs : Subscription
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
    private footer : FooterComponent,
    private calls : CallNumber,
    private clipboard : Clipboard,
    private toast : ToastService
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
  checkTextarea(){
    return this.ionTextarea.getInputElement().then((element) => {
      if(element.style.height == '0px'){
       return  element.style.height = 'auto';
      } else {
        setTimeout(()=> this.checkTextarea(),100)};
      })
  }
  toggleReorderGroup() {
    
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }
  ionViewDidEnter(){
   this.contentSubs = this.route.queryParams.subscribe(params => {
     console.log(params)
      this.content = params["content"];    
      this.ioncontent.scrollToTop(0)
      if(this.content ==="Dining"){
        this.Dining = true
        this.Itinerary =false
        this.footer.onItinerary = false
      }else if(this.content === "Itinerary"){
        // this =true
        this.Dining = false
        this.footer.onItinerary = true
        this.Itinerary = true
        this.events = this.contentServe.getEvents()
    
        this.eventSubs = this.events.subscribe(data =>{
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
        this.generalInfo.getInfo().subscribe(data=>{
          if(data){
            // this.checkTextarea()
            console.log(data)
            this.info = data[0]//to be edit for more user
          }  
        })
      }               
    }); 
  }
  ionViewDidLeave(){
      this.eventSubs.unsubscribe()
      this.contentSubs.unsubscribe()
      this.footer.onItinerary = false
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
  async OpenDining(diningPlace,index) {
   
    console.log( this.contentServe.dines[index])
    setTimeout(()=>{
      this.contentServe.dines[index].expanded = true
    },500)
    console.log( this.contentServe.dines[index])
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
  showMore(this){

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
  callNumber(callerID:string){
    this.calls.callNumber(callerID,true) 
     .then(res => console.log('Launched dialer!', res))
     .catch(err => console.log('Error launching dialer', err));
  }
  copyClipboard(callerID:string){
    this.clipboard.copy(callerID)
    .then(res => this.toast.showToast("copied to clipboard"))
    .catch(err => alert(err));
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
    
    this.generalInfo.getWeddingInfoTakeOne().subscribe(data=>{      
      this.topResto = data[0].dining_list
      
      this.topResto = this.topResto.reduce(function (r, a) {
        a.expanded = false
          r[a.type] = r[a.type] || [];
          r[a.type].push(a);
          return r;
      }, Object.create(null));
      var top_resto = this.topResto
      
      for (var key of Object.keys(top_resto)) {
     
        this.contentServe.dines.push({
          title : key,
          restaurants : top_resto[key],
          expanded : false,
        })
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
      // debugger
      // this.info.wedcast = [
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FAmb%20Antonio%20L.%20Cabangon%20Chua%20-%20Father%20(deceased)%20.jpg?alt=media&token=2a221025-aef9-4d77-b10f-12fab4e4f326",
      //       "name": "Amb Antonio L. Cabangon Chua",
      //       "category": "Bride's Family",
      //       "title": "Father (deceased)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FAna%20Patricia%20Songco%20-%20Cousin%20(Bridesmaid).jpg?alt=media&token=495ba4ba-6011-49c4-ad09-ae61eef88a8a",
      //       "name": "Ana Patricia Songco",
      //       "category": "Bride's Family",
      //       "title": "Cousin (Bridesmaid)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FCatherine%20B.%20Songco%20-%20Mother%20.jpg?alt=media&token=e3ed4d3e-ce4a-45e2-96df-37d70e9766e8",
      //       "name": "Catherine B. Songco",
      //       "category": "Bride's Family",
      //       "title": "Mother"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FD.%20Edgard%20Cabangon%20-%20Brother.jpg?alt=media&token=035fd456-1c8c-43a8-ab59-724ffcc51023",
      //       "name": "D. Edgard Cabangon",
      //       "category": "Bride's Family",
      //       "title": "Brother"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FLorenzo%20S.%20Cabangon%20Chua%20-%20Brother%20(Groomsman)%20.jpg?alt=media&token=c2127f6b-bc41-4494-895d-6bcf925de17b",
      //       "name": "Lorenzo S. Cabangon Chua",
      //       "category": "Bride's Family",
      //       "title": "Brother (Groomsman)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FMica%20S.%20Cabangon%20Chua-%20Sister%20(Maid%20of%20Honor).jpg?alt=media&token=aacdf504-5d10-4fa9-84df-141a3a0622e3",
      //       "name": "Mica S. Cabangon Chua",
      //       "category": "Bride's Family",
      //       "title": "Sister (Maid of Honor)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FMichelle%20S.%20Cabangon%20Chua%20-%20Sister%20(Main%20of%20Honor).jpg?alt=media&token=ea67a703-ca1e-4978-8b06-dba89f931aa9",
      //       "name": "Michelle S. Cabangon Chua",
      //       "category": "Bride's Family",
      //       "title": "Sister (Main of Honor)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FSamantha%20Abigail%20Songco%20-%20Cousin%20(Flower%20Girl).jpg?alt=media&token=d7cd83b0-bcb3-470b-8ce1-b33a71214800",
      //       "name": "Samantha Abigail Songco",
      //       "category": "Bride's Family",
      //       "title": "Cousin (Flower Girl)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FEmilio%20A.%20Pulido%20-%20Groomsman.jpg?alt=media&token=672429da-91e2-4a22-8d59-4e3cda45fe56",
      //       "name": "Emilio A. Pulido",
      //       "category": "Bride's Friends",
      //       "title": "Groomsman"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FEnzo%20M.%20Ocampo%20-%20Groomsman.jpg?alt=media&token=8f43ee25-4da0-472c-8fae-bb50a465307c",
      //       "name": "Enzo M. Ocampo",
      //       "category": "Bride's Friends",
      //       "title": "Groomsman"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FIsabella%20R.%20Tantoco%20-%20Bridesmaid.jpg?alt=media&token=f3f23899-6776-49b7-9061-bc56a2f27344",
      //       "name": "Isabella R. Tantoco",
      //       "category": "Bride's Friends",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FJess%20TG.%20Yap%20-%20Bridesmaid.jpg?alt=media&token=118351c9-a9bb-4fde-b30b-8972c4c4053e",
      //       "name": "Jess TG. Yap",
      //       "category": "Bride's Friends",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FLucille%20R.%20Collie-%20Bridesmaid.jpg?alt=media&token=28d46a0b-a88a-406e-9328-854df4c07ba3",
      //       "name": "Lucille R. Collie",
      //       "category": "Bride's Friends",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FNikki%20T.%20Lopez%20-%20Bridesmaid.jpg?alt=media&token=899095d6-a3f1-4494-a1a8-0efbd6a9a408",
      //       "name": "Nikki T. Lopez",
      //       "category": "Bride's Friends",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FShuen%20Chiu%20-%20Bridesmaid.jpg?alt=media&token=4e5d6ac8-a547-4804-8d5a-15085d837bee",
      //       "name": "Shuen Chiu",
      //       "category": "Bride's Friends",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FAdam%20Barton%20-%20Brother-in-law%20(Best%20Man).jpg?alt=media&token=db5d9731-3ef5-435c-b68f-d9c13d74a0cf",
      //       "name": "Adam Barton",
      //       "category": "Groom's Family",
      //       "title": "Brother-in-law (Best Man)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FCharlie%20W.%20Barton%20-%20Neice%20(Flower%20Girl).jpg?alt=media&token=12a4fe0d-17cf-4b9b-8988-0b5db918c91c",
      //       "name": "Charlie W. Barton",
      //       "category": "Groom's Family",
      //       "title": "Neice (Flower Girl)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FJackson%20W.%20Barton%20-%20Newphew%20(Ring%20Bearer).jpg?alt=media&token=30158393-a556-471d-9109-b6d726aaddd6",
      //       "name": "Jackson W. Barton",
      //       "category": "Groom's Family",
      //       "title": "Newphew (Ring Bearer)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FJanelle%20Woudwyk%20-%20Mother.jpg?alt=media&token=39ca80a2-6645-412a-905e-903a63907656",
      //       "name": "Janelle Woudwyk",
      //       "category": "Groom's Family",
      //       "title": "Mother"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FJohn%20Woudwyk%20-%20Father%20(deceased).jpg?alt=media&token=fb52941e-d616-4564-b716-0c58a7d771c5",
      //       "name": "John Woudwyk",
      //       "category": "Groom's Family",
      //       "title": "Father (deceased)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FRachael%20W.%20Barton%20-%20sister%20(Bridesmaid).jpg?alt=media&token=63130a27-532d-49ef-a1a4-a52485afb08f",
      //       "name": "Rachael W. Barton",
      //       "category": "Groom's Family",
      //       "title": "sister (Bridesmaid)"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FAndro%20L.%20Lopez%20-%20Best%20Man.jpg?alt=media&token=df430d57-51d5-47c3-ac7e-4b899beccad3",
      //       "name": "Andro L. Lopez",
      //       "category": "Groom's Friends",
      //       "title": "Best Man"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FAntonio%20Chan%20-%20Best%20Man.jpg?alt=media&token=1c5169dc-db11-4f68-b114-b5e14c065127",
      //       "name": "Antonio Chan",
      //       "category": "Groom's Friends",
      //       "title": "Best Man"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FBen%20Handsacker%20-%20Best%20Man.jpg?alt=media&token=db685bfb-f6d0-449c-a537-ad9a778eb88a",
      //       "name": "Ben Handsacker",
      //       "category": "Groom's Friends",
      //       "title": "Best Man"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FSteve%20Burns%20-%20Best%20Man.jpg?alt=media&token=1b9138fb-48fa-42eb-90ce-4b87d6b43a84",
      //       "name": "Steve Burns",
      //       "category": "Groom's Friends",
      //       "title": "Best Man"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FTodd%20O'Gara%20-%20Best%20Man.jpg?alt=media&token=6928ecfc-95bf-4bbf-ba91-b532f50eea23",
      //       "name": "Todd O'Gara",
      //       "category": "Groom's Friends",
      //       "title": "Best Man"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FAlex%20Lopez%20-%20sponsors.jpg?alt=media&token=74e60e4d-c56c-4289-a7cd-a5be58ccc2e5",
      //       "name": "Alex Lopez",
      //       "category": "Sponsors",
      //       "title": "Sponsor"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FAtty.%20Jose%20Ferdinand%20M.%20Rojas%20II%20-%20Sponsors.JPG?alt=media&token=5139a788-396b-44b0-bbf2-4ddc919a17c3",
      //       "name": "Atty. Jose Ferdinand M. Rojas II",
      //       "category": "Sponsors",
      //       "title": "Sponsor"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FJustice%20Harriet%20O.%20Demetriou%20-%20sponsors.jpg?alt=media&token=730088c9-a9a3-47f8-af0f-fb863513ed8b",
      //       "name": "Justice Harriet O. Demetriou",
      //       "category": "Sponsors",
      //       "title": "Sponsor"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FSarah%20Lopez%20-%20sponors.jpg?alt=media&token=c7512a17-f96f-4ff2-a9b0-e5b6fd29d3b7",
      //       "name": "Sarah Lopez",
      //       "category": "Sponsors",
      //       "title": "Sponsor"
      //   },
      //   {
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FVivian%20Yuchengco%20-%20sponsors.jpg?alt=media&token=e9115bc2-d9c9-4c08-a183-19fea5cac9cd",
      //       "name": "Vivian Yuchengco",
      //       "category": "Sponsors",
      //       "title": "Sponsor"
      //   }
      // ]
    
      this.generalInfo.updateInfo(this.info.ref,this.info)
    }
    expandItem(item,item_id): void {
      // debugger
      if (item.expanded) {
        item.expanded = false;
      } else {
        this.contentServe.dines.map(listItem => {
          if (item == listItem) {
            listItem.expanded = !listItem.expanded;
          } else {
            listItem.expanded = false;
          }
          return listItem;
        });
        this.scrollTo(item_id)
      }
 
    }
    scrollTo(elementId: string) {
      
      setTimeout(()=>{
        let y = document.getElementById(elementId).offsetTop;
        console.log(y)
        this.ioncontent.scrollToPoint(0, y,500);
      },500)  
    }
    customExpand(item,index,resto):void{
  
      // this.contentServe.dines[index].expanded = true
      if (item.expanded) {
        item.expanded = false;
      } else {
        this.contentServe.dines[index].restaurants.map(listItem => {
          if (item == listItem) {
            listItem.expanded = !listItem.expanded;
          } else {
            listItem.expanded = false;
          }
          return listItem;
        });
      }
    }
    // openReception(){    
    //   var url = 'https://www.google.com/maps/search/?api=1&query=-45.033001,168.660799'
    //   window.open(url, '_system');
    // }

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
