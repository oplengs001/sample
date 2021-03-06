import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeMenuPage } from '../modals/menu/home-menu.page';
import { AnnouncementSaveService } from '../services/announcements/announcement-save.service';
import { GeneralInfoService } from '../services/content/general-info.service';
import { IonContent } from '@ionic/angular';
import { SharedComponent } from '../shared-component/shared';

@Component({
  selector: 'app-wedcast',
  templateUrl: './wedcast.page.html',
  styleUrls: ['./wedcast.page.scss'],
})
export class WedcastPage implements OnInit {
@ViewChild(IonContent, {static: false}) ioncontent: IonContent;
private cast
private gMessage: string
private gTitle : string
private categories : any =[]
private sliderOptions : any;
  constructor(
    private homeMenu: HomeMenuPage,
    private annServe : AnnouncementSaveService,
    private gInfo : GeneralInfoService,
    private sharedComps : SharedComponent
  ) { }

  ngOnInit() {
    this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
      this.gMessage = data[0].wed_cast_message
      this.gTitle = data[0].wed_cast_title
      this.cast = data[0].wedcast
      this.cast = this.cast.reduce(function (r, a) {
        a.expanded = false
          r[a.category] = r[a.category] || [];
          r[a.category].push(a);
          return r;
      }, Object.create(null));
      var cast_items = this.cast
      
      for (var key of Object.keys(cast_items)) {
     
        this.categories.push({
          title : key,
          casts : cast_items[key],
          expanded : false,
        })
      }
    })
  }
  expandItem(item,item_id): void {
    // debugger
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.categories.map(listItem => {
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
  ionViewDidEnter(){
    this.ioncontent.forceOverscroll = true
    this.ioncontent.scrollToTop(0)
  }
  imageLoaded(event,isLoaded: boolean) {    
    if (isLoaded) {
        event.target.parentElement.classList.add('img-loaded');
      // }, 500);      
    } else {
        event.target.parentElement.classList.remove('img-loaded');
    }
  }
  scrollTo(elementId: string) {
      
    setTimeout(()=>{
      let y = document.getElementById(elementId).offsetTop;
      console.log(y)
      this.ioncontent.scrollToPoint(0, y,500);
    },500)  
  }
}
