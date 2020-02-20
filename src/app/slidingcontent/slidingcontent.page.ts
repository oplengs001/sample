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
      //       "category": "Principal Sponsors",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FJustice%20Harriet%20O.%20Demetriou%20-%20sponsors.jpg?alt=media&token=730088c9-a9a3-47f8-af0f-fb863513ed8b",
      //       "name": "Justice Harriet O. Demetriou",
      //       "title": "Principal Sponsor"
      //   },
      //   {
      //       "category": "Principal Sponsors",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FAlex%20Lopez%20-%20sponsors.jpg?alt=media&token=74e60e4d-c56c-4289-a7cd-a5be58ccc2e5",
      //       "name": "Atty. Alex Lopez",
      //       "title": "Principal Sponsor"
      //   },
      //   {
      //       "category": "Principal Sponsors",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FSarah%20Lopez%20-%20sponors.jpg?alt=media&token=c7512a17-f96f-4ff2-a9b0-e5b6fd29d3b7",
      //       "name": "Sarah Lopez",
      //       "title": "Principal Sponsor"
      //   },
      //   {
      //       "category": "Principal Sponsors",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2FAtty.%20Jose%20Ferdinand%20M.%20Rojas%20II%20-%20Sponsors.JPG?alt=media&token=5139a788-396b-44b0-bbf2-4ddc919a17c3",
      //       "name": "Atty. Jose Ferdinand M. Rojas II",
      //       "title": "Principal Sponsor"
      //   },
      //   {
      //       "category": "Principal Sponsors",
      //       "image": "https://pbs.twimg.com/profile_images/1174592604673101824/fk_uV_hn_400x400.jpg",
      //       "name": "Rusell Small",
      //       "title": "Principal Sponsor"
      //   },
      //   {
      //       "category": "Principal Sponsors",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FSponsors%2Fvivian.jpg?alt=media&token=203fad9f-67f5-4647-adab-7cc0cac85da2",
      //       "name": "Vivian Yuchengco",
      //       "title": "Principal Sponsor"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FAmb%20Antonio%20L.%20Cabangon%20Chua%20-%20Father%20(deceased)%20.jpg?alt=media&token=2a221025-aef9-4d77-b10f-12fab4e4f326",
      //       "name": "Amb Antonio L. Cabangon Chua",
      //       "custom_type":"father",
      //       "title": "Father (deceased)"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2Fcathy.jpg?alt=media&token=3491d62d-f6ba-4098-bf59-96c3ee42d18a",
      //       "name": "Catherine B. Songco",
      //       "title": "Mother"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2Fedgard.jpeg?alt=media&token=f5e00db1-b3f6-4e54-a3b8-ee5ee01ec47c",
      //       "name": "D. Edgard Cabangon",
      //       "title": "Brother"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FLorenzo%20S.%20Cabangon%20Chua%20-%20Brother%20(Groomsman)%20.jpg?alt=media&token=c2127f6b-bc41-4494-895d-6bcf925de17b",
      //       "name": "Lorenzo S. Cabangon Chua",
      //       "title": "Brother (Groomsman)"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FMichelle%20S.%20Cabangon%20Chua%20-%20Sister%20(Main%20of%20Honor).jpg?alt=media&token=ea67a703-ca1e-4978-8b06-dba89f931aa9",
      //       "name": "Michelle S. Cabangon Chua",
      //       "title": "Sister (Maid of Honor)"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FMica%20S.%20Cabangon%20Chua-%20Sister%20(Maid%20of%20Honor).jpg?alt=media&token=aacdf504-5d10-4fa9-84df-141a3a0622e3",
      //       "name": "Mica S. Cabangon Chua",
      //       "title": "Sister (Maid of Honor)"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FAna%20Patricia%20Songco%20-%20Cousin%20(Bridesmaid).jpg?alt=media&token=495ba4ba-6011-49c4-ad09-ae61eef88a8a",
      //       "name": "Ana Patricia Songco",
      //       "title": "Cousin (Bridesmaid)"
      //   },
      //   {
      //       "category": "Bride's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Family%2FSamantha%20Abigail%20Songco%20-%20Cousin%20(Flower%20Girl).jpg?alt=media&token=d7cd83b0-bcb3-470b-8ce1-b33a71214800",
      //       "name": "Samantha Abigail Songco",
      //       "title": "Cousin (Flower Girl)"
      //   },
      //   {
      //       "category": "Bride's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FShuen%20Chiu%20-%20Bridesmaid.jpg?alt=media&token=4e5d6ac8-a547-4804-8d5a-15085d837bee",
      //       "name": "Shuen Chiu",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "category": "Bride's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FLucille%20R.%20Collie-%20Bridesmaid.jpg?alt=media&token=28d46a0b-a88a-406e-9328-854df4c07ba3",
      //       "name": "Lucille R. Collie",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "category": "Bride's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FNikki%20T.%20Lopez%20-%20Bridesmaid.jpg?alt=media&token=899095d6-a3f1-4494-a1a8-0efbd6a9a408",
      //       "name": "Dominique T. Lopez",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "category": "Bride's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FEnzo%20M.%20Ocampo%20-%20Groomsman.jpg?alt=media&token=8f43ee25-4da0-472c-8fae-bb50a465307c",
      //       "name": "Enzo M. Ocampo",
      //       "title": "Groomsman"
      //   },
      //   {
      //       "category": "Bride's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FEmilio%20A.%20Pulido%20-%20Groomsman.jpg?alt=media&token=672429da-91e2-4a22-8d59-4e3cda45fe56",
      //       "name": "Emilio A. Pulido",
      //       "title": "Groomsman"
      //   },
      //   {
      //       "category": "Bride's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FIsabella%20R.%20Tantoco%20-%20Bridesmaid.jpg?alt=media&token=f3f23899-6776-49b7-9061-bc56a2f27344",
      //       "name": "Isabella R. Tantoco",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "category": "Bride's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FBride's%20Friends%2FJess%20TG.%20Yap%20-%20Bridesmaid.jpg?alt=media&token=118351c9-a9bb-4fde-b30b-8972c4c4053e",
      //       "name": "Jess TG. Yap",
      //       "title": "Bridesmaid"
      //   },
      //   {
      //       "category": "Groom's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FJohn%20Woudwyk%20-%20Father%20(deceased).jpg?alt=media&token=fb52941e-d616-4564-b716-0c58a7d771c5",
      //       "name": "John Woudwyk",
      //       "title": "Father (deceased)"
      //   },
      //   {
      //       "category": "Groom's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FJanelle%20Woudwyk%20-%20Mother.jpg?alt=media&token=7502e276-d6d3-42b2-bd70-2e3f870a9ce3",
      //       "name": "Janelle Woudwyk",
      //       "title": "Mother"
      //   },
      //   {
      //       "category": "Groom's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FRachael%20W.%20Barton%20-%20sister%20(Bridesmaid).jpg?alt=media&token=63130a27-532d-49ef-a1a4-a52485afb08f",
      //       "name": "Rachael W. Barton",
      //       "title": "Sister (Bridesmaid)"
      //   },
      //   {
      //       "category": "Groom's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2FAdam%20Barton%20-%20Brother-in-law%20(Best%20Man).jpg?alt=media&token=db5d9731-3ef5-435c-b68f-d9c13d74a0cf",
      //       "name": "Adam Barton",
      //       "title": "Brother-in-law (Best Man)"
      //   },
      //   {
      //       "category": "Groom's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2Fjacskon.jpeg?alt=media&token=c960f894-cd3e-4cf5-be1c-f34acac470b1",
      //       "name": "Jackson W. Barton",
      //       "title": "Nephew (Ring Bearer)"
      //   },
      //   {
      //       "category": "Groom's Family",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Family%2Fcharlie.jpeg?alt=media&token=1eecc6a0-8bdc-4bdb-b257-82e3c057f04e",
      //       "name": "Charlie W. Barton",
      //       "title": "Neice (Flower Girl)"
      //   },
      //   {
      //       "category": "Groom's Friends",
      //       "image": "data:image/png;base64,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",
      //       "name": "Shaun Ahearn",
      //       "title": "Best Man"
      //   },
      //   {
      //       "category": "Groom's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FSteve%20Burns%20-%20Best%20Man.jpg?alt=media&token=1b9138fb-48fa-42eb-90ce-4b87d6b43a84",
      //       "name": "Steve Burns",
      //       "title": "Best Man"
      //   },
      //   {
      //       "category": "Groom's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FBen%20Handsacker%20-%20Best%20Man.jpg?alt=media&token=db685bfb-f6d0-449c-a537-ad9a778eb88a",
      //       "name": "Ben Handsacker",
      //       "title": "Best Man"
      //   },
      //   {
      //       "category": "Groom's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FAntonio%20Chan%20-%20Best%20Man.jpg?alt=media&token=1c5169dc-db11-4f68-b114-b5e14c065127",
      //       "name": "Antonio Chan",
      //       "title": "Best Man"
      //   },
      //   {
      //       "category": "Groom's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FAndro%20L.%20Lopez%20-%20Best%20Man.jpg?alt=media&token=df430d57-51d5-47c3-ac7e-4b899beccad3",
      //       "name": "Marco Alejandro L. Lopez",
      //       "title": "Best Man"
      //   },
      //   {
      //       "category": "Groom's Friends",
      //       "image": "https://firebasestorage.googleapis.com/v0/b/sampleproject-79081.appspot.com/o/wedcast%2FGroom's%20Friends%2FTodd%20O'Gara%20-%20Best%20Man.jpg?alt=media&token=6928ecfc-95bf-4bbf-ba91-b532f50eea23",
      //       "name": "Todd O'Gara",
      //       "title": "Best Man"
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
