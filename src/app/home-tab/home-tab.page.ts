import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import {  Router } from '@angular/router';
import { ImagesService ,ImageItem } from "../services/uploads/images.service"
import { Observable, Subscription } from 'rxjs';
import { TransitionsService } from '../services/native/transitions.service';
@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit, OnDestroy {
  private posts: Observable<ImageItem[]>;
  private subscription : Subscription;
  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };
  constructor(
    private router: Router,
    private imageService : ImagesService,
    private transServe : TransitionsService
  ) { 

  }
  slidesDidLoad(
    slides: IonSlides,
    ) {
    slides.startAutoplay();
  }
  ngOnInit() {
    this.posts = this.imageService.getRefHome();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
  reRoute(page:string){
    console.log(page)
    this.router.navigateByUrl(page);
  }
}
