import { Injectable } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import {  Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class TransitionsService {

  constructor(
    private nativePageTransitions: NativePageTransitions,
    private router : Router
    ) { }
    
    reRoute(location : string){
      let options: NativeTransitionOptions = {
        direction: 'left',
        duration: 400,
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
    backButtonTrans(){
      let options: NativeTransitionOptions = {
        direction: 'right',
        duration: 400,
        // slowdownfactor: -1,
        // slidePixels: 20,
        // iosdelay: 100,
        // androiddelay: 150,
        // fixedPixelsTop: 0,
        // fixedPixelsBottom: 60
       }
    
      this.nativePageTransitions.slide(options)
      
    }
}
