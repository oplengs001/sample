import { Component, OnInit  } from '@angular/core';
import { ModalController} from '@ionic/angular';
@Component({
  selector: 'app-viewingcontent',
  templateUrl: './viewingcontent.page.html',
  styleUrls: ['./viewingcontent.page.scss'],
})

export class ViewingcontentPage implements OnInit {
  view_content  : any
  constructor(
    private mdlctrl: ModalController) { }

  ngOnInit() {
  }
  async closeModal (){
    this.mdlctrl.dismiss()
  }
openLink(url){
    // window.open(url, '_system');
  }
}
