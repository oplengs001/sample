import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {Geolocation} from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder,NativeGeocoderOptions,NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { TransitionsService } from '../services/native/transitions.service';
import { IonSlides } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { GeneralInfoService ,Info} from "../services/content/general-info.service"
import { FooterComponent } from "../footer/footer.component"
import { AuthService } from '../services/auth/auth.service'
// declare var google;
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
  private info : Info

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
    //  private nativeGeocoder: NativeGeocoder,
     private transServe : TransitionsService,
     private infoService : GeneralInfoService,
     private fComp : FooterComponent,
     private authServ : AuthService,
  ) {
    this.createDirectionForm();
  }
  slidesDidLoad(
    slides: IonSlides,
    ) {
    slides.startAutoplay();
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
        this.info = data[0]        
      }  
    })
    this.authServ.currentUserData().then(data=>{
      this.isAdmin = data.isAdmin
    })
  } 
  ShowMap(){
    this.CardHide = true
    this.MapHide = false
  }
  ShowChurch(){
    this.CardHide = false
    this.MapHide = true
  }
  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
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