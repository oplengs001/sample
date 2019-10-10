import { Component, OnInit } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-slidingcontent',
  templateUrl: './slidingcontent.page.html',
  styleUrls: ['./slidingcontent.page.scss'],
})
export class SlidingcontentPage implements OnInit {
  content :string
  topResto : any = []
  constructor(
    private transServe : TransitionsService,
    private route : ActivatedRoute
  ) { 

    this.route.queryParams.subscribe(params => {
      this.content = params["content"];      
    });
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
    
  ngOnInit() {
    
  }

}
