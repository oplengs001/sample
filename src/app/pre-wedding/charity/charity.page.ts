import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { GeneralInfoService} from "../../services/content/general-info.service"
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { SharedComponent } from 'src/app/shared-component/shared';
@Component({
  selector: 'app-charity',
  templateUrl: './charity.page.html',
  styleUrls: ['./charity.page.scss'],
})
export class CharityPage implements OnInit {
  charity :any
  public items: any = [];
  constructor( 
     private homeMenu: HomeMenuPage,
     private generalInfo : GeneralInfoService,
     private annServe : AnnouncementSaveService,
     private sharedComps : SharedComponent
     ) { 
      this.items = [      
        { 
          expanded: false,
          text: `The name Haribon was coined from Haring Ibon or the Philippine Eagle, the existence of which constitutes a rich thriving biodiverse environment. Haribon advocates biodiversity conservation through building constituencies, empowering communities and applying multi-disciplinary approaches. Sandari Batulao has partnered with Haribon Foundation in ensuring that the flora and fauna that surrounds its development will continue to thrive,
                 as well as providing an education program for its nearby schools to help create future generations of nature’s guardians.  `,
          url: "https://haribon.org.ph/donate/general-donation/",
          url_tag: "Donate now",
          image_link : "/assets/images/charity/haribon.png",
          title : "Haribon Foundation"
        },
        { 
          expanded: false,
          text: `Philippine Pet Birth Control Center Foundation aims to make a change in the companion animal welfare by eradicating rabies through controlling the animal population in the most humane way: neutering. They have neutered over 50,000 cats and dogs since 2017 and Sandari Batulao aims to help them reach their goal
                 of 100,000 neutered cats and dogs. They do this by providing affordable access to neutering in Metro Manila and the rest of the Philippines. `,
          url: "https://www.paypal.me/supportPPBCC",
          url_tag: "Donate Now",          
          image_link : "/assets/images/charity/ppbcc.jpg",
          title : "PPBCC Foundation"
        },
        { 
          expanded: false,
          text: `The Koala Hospital is a licensed Wildlife Rehabilitation Facility carrying out on-site procedures. All procedures and treatments are done at the Koala Hospital except for major surgeries and
                 X rays which are undertaken at the Port Macquarie Veterinary Hospital. Being a research/study centre it not only has a strong affiliation with University Sydney, University Technology Queensland and the Australian Museum, but also networks with many institutions, zoos, wildlife researchers, wildlife veterinarians and numerous wildlife rehabilitation groups worldwide.`,
          url: "https://www.koalahospital.org.au/shop/donation",
          url_tag: "Donate Now",
          image_link : "/assets/images/charity/koala.png",
          title : "Koala Hospital Port Macquarie "
        },    
        { 
          expanded: false,
          text: `The NSW Rural Fire Service (NSW RFS) is the lead combat agency for bush fires in NSW. For over 100 years we have been a significant part of the history and landscape of NSW. Working closely with other agencies we respond to a range of 
                emergencies including structure fires, motor vehicle accidents and storms that occur within rural fire districts. `,
          url: "https://www.rfs.nsw.gov.au/volunteer/support-your-local-brigade",
          url_tag: "Donate Now",
          image_link : "/assets/images/charity/rfs.png",
          title : "The NSW Rural Fire Service"
        },
       
      ];
    }

  ngOnInit() {
    this.generalInfo.getWeddingInfoTakeOne().subscribe(data=>{      
      this.charity = data[0]
    })
  }
  expandItem(item): void {
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
    }
  }
  openLink(url){
    window.open(url, '_system');
  }
}
