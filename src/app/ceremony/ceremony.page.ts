import {AfterViewInit, Component, ElementRef, OnInit, ViewChild,Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import {Geolocation} from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder,NativeGeocoderOptions,NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { TransitionsService } from '../services/native/transitions.service';
import { IonSlides } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { GeneralInfoService ,Info} from "../services/content/general-info.service"
import { FooterComponent } from "../footer/footer.component"
import { AuthService } from '../services/auth/auth.service'
import { ActionClass} from '../gallery-action-sheet/actionsheet'
import { LoadingController,ModalController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {NgxImageCompressService} from 'ngx-image-compress';
import { GettingTherePage } from "../modals/getting-there/getting-there.page"
// declare var google;
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-ceremony',
  templateUrl: './ceremony.page.html',
  styleUrls: ['./ceremony.page.scss'],
})
export class CeremonyPage implements OnInit, AfterViewInit {
  private posts: Observable<ImageItem[]>;
  private gInfo: Observable<Info[]>
  private subscription : Subscription;
  private isAdmin:boolean
  public info : Info
  private events: any ;
  @ViewChild('mapElement', {static: false}) mapNativeElement: ElementRef;
  
  // directionsService = new google.maps.DirectionsService;
  // directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  currentLocation: any = {
    lat: 0,
    lng: 0
  };
  CardHide:boolean;
  MapHide:boolean;
  constructor(
     private fb: FormBuilder,
    //  private geolocation: Geolocation,
     private imageService : ImagesService,
     private imagePicker : ImagePicker,
    //  private nativeGeocoder: NativeGeocoder,
     private transServe : TransitionsService,
     private infoService : GeneralInfoService,
     private fComp : FooterComponent,
     private webview : WebView,
     private authServ : AuthService,
     private actions : ActionClass,
     public loadingController: LoadingController,
     private imageCompress: NgxImageCompressService,
     private modalController : ModalController,     
  ) {
    this.createDirectionForm();
  }
 
  saveItem(){    
    this.infoService.updateInfo(this.info.ref,this.info)
  }
  ngOnInit() {
    this.posts = this.imageService.getRefHome();
    this.CardHide = false
    this.MapHide = true
    this.infoService.getInfo().subscribe(data=>{
      if(data){
        this.info = data[0]        //to be edit for more user
      }  
    })
    this.authServ.currentUserData().then(data=>{
      this.isAdmin = data.isAdmin
    })

    
  }  
  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }
  changeImage(){
    if(this.isAdmin){
        this.actions.confirmationMessage("Your about to change to wedding image").then(res=>{
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
        this.saveItem()
        loading.dismiss()        
      })
    })
  
  }
  async openMap() {    
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: GettingTherePage,         
    });          
    await modal.present();
  }
  ngAfterViewInit(): void {
    
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.currentLocation.lat = resp.coords.latitude;
    //   this.currentLocation.lng = resp.coords.longitude;
    
    // });
    // const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
    //   zoom: 13,
    //   center: {lat: 14.560521, lng: 121.025996}
    // });
    // this.directionsDisplay.setMap(map);    
    // this.calculateAndDisplayRouteToChurch()
  }
  calculateAndDisplayRouteToChurch() {
    const destination =  {lat:14.071402, lng:120.835937}
    const that = this;
    // this.directionsService.route({
    //   origin: this.currentLocation,
    //   destination: destination,    
    //   travelMode: 'DRIVING'
    // }, (response, status) => {
    //   if (status === 'OK') {
    //     that.directionsDisplay.setOptions({ preserveViewport: true });
    //     that.directionsDisplay.setDirections(response);
       
    //   } else {
        
    //     window.alert('Directions request failed due to ' + status);
    //   }
    // });
  }
  calculateAndDisplayRoute(formValues) {
    const that = this;
  //   this.directionsService.route({
  //     origin: formValues.source,
  //     destination: formValues.destination,
  //     travelMode: 'DRIVING'
  //   }, (response, status) => {
  //     if (status === 'OK') {
  //       that.directionsDisplay.setDirections(response);
  //     } else {
  //       window.alert('Directions request failed due to ' + status);
  //     }
  //   });
  // }
  }
}