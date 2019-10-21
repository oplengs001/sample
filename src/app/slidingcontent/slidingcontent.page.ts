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
  event_it : any = []
  Dining: boolean
  Itenerary :boolean
  constructor(
    private transServe : TransitionsService,
    private route : ActivatedRoute
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
    
  ngOnInit() {
    
  }

}
