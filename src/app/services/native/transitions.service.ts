import { Injectable } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { NavController } from '@ionic/angular';
import {  Router ,NavigationExtras} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class TransitionsService {

  constructor(
    private nativePageTransitions: NativePageTransitions,
    private router : Router,
    private navCtrl : NavController
    ) { }
    
    reRoute(location : string){
      let options: NativeTransitionOptions = {
        direction: 'left',
        duration: 100,
        // slowdownfactor: -1,
        // slidePixels: 20,
        // iosdelay: 100,
        // androiddelay: 150,
        // fixedPixelsTop: 0,
        // fixedPixelsBottom: 60
       }
    
      this.nativePageTransitions.slide(options)
      this.router.navigateByUrl(location);          
    }
    reRouteNoAnimation(location : string){       
      this.router.navigateByUrl(location);          
    }
    reRouteActivity(content:string){
      let options: NativeTransitionOptions = {
        direction: 'left',
        duration: 100,
        // slowdownfactor: -1,
        // slidePixels: 20,
        // iosdelay: 100,
        // androiddelay: 150,
        // fixedPixelsTop: 0,
        // fixedPixelsBottom: 60
       }
    
      this.nativePageTransitions.slide(options)
      let navigationExtras: NavigationExtras = {
          queryParams: {
              content: content,
          }
      };
      this.navCtrl.navigateForward(['slidingcontent'], navigationExtras);
    }
    reRouteActivityNoAnimation(content:string){    
      let navigationExtras: NavigationExtras = {
          queryParams: {
              content: content,
          }
      };
      this.navCtrl.navigateForward(['slidingcontent'], navigationExtras);
    }
    backButtonTrans(){
      let options: NativeTransitionOptions = {
        direction: 'right',
        duration: 100,
        // slowdownfactor: -1,
        // slidePixels: 20,
        // iosdelay: 100,
        // androiddelay: 150,
        // fixedPixelsTop: 0,
        // fixedPixelsBottom: 60
       }
    
      this.nativePageTransitions.slide(options)
      this.router.navigateByUrl("home");
      
    }
}
