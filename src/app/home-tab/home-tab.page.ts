import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { IonSlides, IonContent } from '@ionic/angular';
import {  Router } from '@angular/router';
import { TransitionsService } from '../services/native/transitions.service';
import { FooterComponent } from '../footer/footer.component';
import { SharedComponent } from '../shared-component/shared';
import { AnnouncementSaveService } from '../services/announcements/announcement-save.service';
@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, {static: false}) ioncontent: IonContent;
  public items: any = [];

  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };
  constructor(
    private router: Router,
    private sharedComps : SharedComponent,
    private transServe : TransitionsService,
    private annServe : AnnouncementSaveService
  ) { 
    this.items = [
      { 
        expanded: false,
        text: `Tom and Ingga recommendations -
               We recommend hiring the ski and snowboard equipment at the resort you're going to ski in.
              However if you would like a full list of the ski rental stores please see`,
        url: "https://www.queenstownnz.co.nz/things-to-do/skiing-and-snowboarding/ski-and-snowboard-hire/",
        url_tag: "Queenstown Ski and Snowboard Hire",
        image_link : "/assets/images/activities/ski1.jpg",
        title : "Skiing & Snowboarding"
      },
      { 
        expanded: false,
        text: `Queenstown has been shaped by many different cultures and lifestyles from its earliest days—but it’s
               adventure that has the most lasting mark on those who visit or choose to live here. Queenstown is the adventure capital of the world!`,
        url: "https://www.queenstownnz.co.nz/things-to-do/adventure-activities/",
        url_tag: "Queenstown Adventure",
        image_link : "/assets/images/activities/adv.jpg",
        title : "Adventure"
      },
      { 
        expanded: false,
        text: `Perfect destination to escape to for rejuvenation and revitalisation and there are a wide range of health,
               beauty and wellness services for visitors and locals alike. `,
        url: "https://www.queenstownnz.co.nz/things-to-do/beauty-and-wellness/",
        url_tag: "Beauty & Wellness",
        image_link : "/assets/images/activities/wellness.jpg",
        title : "Beauty & Wellness"
      },    
      { 
        expanded: false,
        text: `Take to the air on a scenic flight, cruise across Lake Wakatipu and see the mountains from a new perspective
               ,or be carried high over Queenstown in a gondola and take in the views, there are activities for all travellers.`,
        url: "https://www.queenstownnz.co.nz/things-to-do/sightseeing/",
        url_tag: "Sightseeing",
        image_link : "/assets/images/activities/sight.jpg",
        title : "Sightseeing"
      },
      { 
        expanded: false,
        text: `Delve into Queenstown’s nightlife at any one of our bars to rehydrate and get a taste of local fine wine and killer cocktails—a night out in Queenstown 
              is great fun and you’ll meet travellers and locals from around the world any night of the week`,
        url: "https://www.queenstownnz.co.nz/things-to-do/nightlife/",
        url_tag: "Queenstown Nightlife",
        image_link : "/assets/images/activities/nightlife.jpg",
        title : "Nightlife"
      },
      { 
        expanded: false,
        text: `Travelling with your family is about discovering new things together safely, so you can watch your young ones learn about themselves 
            and the world around them. There are many activities 
            in Queenstown that are suitable for children and most companies
            offer kids’ prices or even ‘kids go free’ promotions at certain times of the year.`,
        url: "https://www.queenstownnz.co.nz/things-to-do/family-fun/",
        url_tag: "Family Fun",
        image_link : "/assets/images/activities/family.jpg",
        title : "Family Fun"
      },
      { 
        expanded: false,
        text: `Venture off road or into the bush to learn about the region's astounding natural heritage, 
              or explore the old farm homesteads and historic gold mining villages for a peek into early settler life. There are also numerous heritage walks 
              to be had in and around Queenstown, exploring the unforgettable natural scenery that forms the backbone to this region's fascinating history`,
        url: "https://www.queenstownnz.co.nz/things-to-do/culture-and-heritage/",
        url_tag: "Queenstown Culture & Heritage",
        image_link : "/assets/images/activities/culture.jpg",
        title : "Culture & Heritage"
      },
      { 
        expanded: false,
        text: `Queenstown boasts great shopping with luxury brands, iconic New Zealand design stores,
               souvenirs, boutique fashion and adventure sports equipment aplenty all centrally located in the compact town.`,
        url: "https://www.queenstownnz.co.nz/things-to-do/shopping/",
        url_tag: "Queenstown Shopping",
        image_link : "/assets/images/activities/shopping.jpg",
        title : " Shopping"
      },
      { 
        expanded: false,
        text: `The wineries in Queenstown and nearby Gibbston, the 'Valley of Vines',
              have a reputation for producing some of the world’s best Pinot Noir, and it’s easy
              to while away a day exploring cellar doors and restaurants to find your favourite vintage.`,
        url: "https://www.queenstownnz.co.nz/things-to-do/wineries/",
        url_tag: "Queenstown Wineries",
        image_link : "/assets/images/activities/wineries.jpg",
        title : "Wineries"
      }
     
    ];
  }
  slidesDidLoad(
    slides: IonSlides,
    ) {
    slides.startAutoplay();
  }
  expandItem(item,item_id): void {
    console.log(item_id)
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
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
      this.ioncontent.scrollToPoint(0, y,500);
    },500)  
  }
  ngOnInit() {
    
  }
  openLink(url){
    // window.open(url, '_system');
  }
  ngOnDestroy(){

  }
  reRoute(page:string){
    console.log(page)
    this.router.navigateByUrl(page);
  }
}
