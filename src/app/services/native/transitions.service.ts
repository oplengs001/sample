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
      this.nativePageTransitions.fade(null);
      this.router.navigateByUrl(location);
    }
}
