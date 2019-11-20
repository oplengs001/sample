import { Component, OnInit ,ViewChild } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
import { ActivatedRoute } from '@angular/router';
import { IonReorderGroup } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service'
import { ActionClass} from '../gallery-action-sheet/actionsheet'
import { ModalController, IonContent } from '@ionic/angular';
import { CreateEventPage } from '../modals/create-event/create-event.page';
import { SlidingContentService, Itenerary } from "../services/content/sliding-content.service"
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
  Itenerary :boolean
  isAdmin : boolean
  tba : boolean
  hideElements :boolean
  events: Observable<Itenerary[]>;
  event_data : any
  lastPosition : number
  constructor(
    private transServe : TransitionsService,
    private authServ : AuthService,
    private actions : ActionClass,
    private route : ActivatedRoute,
    private contentServe : SlidingContentService,
    private modalController : ModalController
  ) {   
    this.Dining = false
    this.Itenerary = false

    this.route.queryParams.subscribe(params => {
      this.content = params["content"];      
      
      if(this.content==="Dining"){
        this.Dining = true
      }else if(this.content === "Itenerary"){
    
        this.Itenerary = true
      }
    });
    this.event_it = [
      {
        image_url: "/assets/images/itenerary/arrival.jpg",
        name: "The Arrival",
        location: "17 Marine Parade, Queenstown 9300"
      },
      {
        image_url: "/assets/images/itenerary/ido.jpg",
        name: "Do You's & I Do's",
        location: "Te Nuku, 43 Ballarat St, Queenstown 9348"
      },
      {
        image_url: "/assets/images/itenerary/raiseyourglass.jpg",
        name: "Raise Your Glass!",
        location: "14 Cow Ln, Queenstown 9300"
      },
      {
        image_url: "/assets/images/itenerary/entrance.jpg",
        name: "The Entrance",
        location: "8 Duke St, Queenstown 9300"
      },
      {
        image_url: "/assets/images/itenerary/samedayedit.jpg",
        name: "Wedding Video (Same day Edit)",
        location: "16 Church St, Queenstown 9300"
      },  
      {
        image_url: "/assets/images/itenerary/sweetdance.jpg",
        name: "Sweet Dance",
        location: "9 Isle St, Queenstown 9300"
      },     
      {
        image_url: "/assets/images/itenerary/danceparty.jpg",
        name: "Party Time!",
        location: "3 Searle Ln, Queenstown 9300"
      }
    ]

    this.topResto = [
      {
        image_url: "/assets/images/dining/botswana.jpg",
        name: "Botswana Butchery",
        location: "17 Marine Parade, Queenstown 9300"
      },
      {
        image_url: "/assets/images/dining/rata.jpg",
        name: "Rata",
        location: "Te Nuku, 43 Ballarat St, Queenstown 9348"
      },
      {
        image_url: "/assets/images/dining/the bunker.jpg",
        name: "The Bunker",
        location: "14 Cow Ln, Queenstown 9300"
      },
      {
        image_url: "/assets/images/dining/jervois.jpg",
        name: "Jervois Steak House",
        location: "8 Duke St, Queenstown 9300"
      },
      {
        image_url: "/assets/images/dining/bluekanu.jpg",
        name: "Blue Kanu",
        location: "16 Church St, Queenstown 9300"
      },
      {
        image_url: "/assets/images/dining/tacomedic.jpg",
        name: "Taco Medic",
        location: "3 Searle Ln, Queenstown 9300"
      },    
      {
        image_url: "/assets/images/dining/bespoke.jpg",
        name: "Bespoke Kitchen",
        location: "9 Isle St, Queenstown 9300"
      },
      {
        image_url: "/assets/images/dining/ferg.jpg",
        name: "Fergburger",
        location: "42 Shotover St, Queenstown 9300"
      },
      {
        image_url: "/assets/images/dining/carib.jpg",
        name: "Caribe Latin Kitchen",
        location: "36 Ballarat St, Queenstown 9300"
      },      
    ]
    
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
  ngOnInit() {    
    // this.isAdmin = this.authServ.isAdmin()
    this.tba = true
    this.hideElements = true
    this.authServ.currentUserData().then(data=>{
      this.isAdmin = data.isAdmin
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
      
    })
  }

}
