import { Component, OnInit } from '@angular/core';
import { HomeMenuPage } from '../../modals/menu/home-menu.page'
import { AnnouncementSaveService } from 'src/app/services/announcements/announcement-save.service';
import { SharedComponent } from 'src/app/shared-component/shared';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastService } from 'src/app/services/toaster/toast-service';
@Component({
  selector: 'app-accomodations',
  templateUrl: './accomodations.page.html',
  styleUrls: ['./accomodations.page.scss'],
})
export class AccomodationsPage implements OnInit {

  constructor(
    private homeMenu: HomeMenuPage,
    private annServe: AnnouncementSaveService,
    private sharedComps : SharedComponent,
    private calls : CallNumber,
    private clipboard : Clipboard,
    private toast : ToastService
    ) { }

  ngOnInit() {
  }
  callNumber(callerID:string){
    this.calls.callNumber(callerID,true) 
     .then(res => console.log('Launched dialer!', res))
     .catch(err => console.log('Error launching dialer', err));
  }
  copyClipboard(callerID:string){
    this.clipboard.copy(callerID)
    .then(res => this.toast.showToast("copied to clipboard"))
    .catch(err => alert(err));
  }
  openLink(url){
    // window.open(url, '_system');
  }
}
