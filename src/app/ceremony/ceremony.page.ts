import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,NativeGeocoderOptions,NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
declare var google;
@Component({
  selector: 'app-ceremony',
  templateUrl: './ceremony.page.html',
  styleUrls: ['./ceremony.page.scss'],
})

export class CeremonyPage implements OnInit, AfterViewInit {

  @ViewChild('mapElement', {static: false}) mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  currentLocation: any = {
    lat: 0,
    lng: 0
  };
  CardHide:boolean;
  MapHide:boolean;
  constructor(
     private fb: FormBuilder,
     private geolocation: Geolocation,
     private nativeGeocoder: NativeGeocoder     
  ) {
    this.createDirectionForm();
  }
  ngOnInit() {
    this.CardHide = false
    this.MapHide = true
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
      destination: ['', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLocation.lat = resp.coords.latitude;
      this.currentLocation.lng = resp.coords.longitude;
    });
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 13,
      center: {lat: 14.560521, lng: 121.025996}
    });
    this.directionsDisplay.setMap(map);
  }
  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route({
      origin: this.currentLocation,
      destination: formValues.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}