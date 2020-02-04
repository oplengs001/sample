import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { ImagePage } from '../photos/image/image.page'
import { GeneralInfoService } from 'src/app/services/content/general-info.service';
@Component({
  selector: 'app-getting-there',
  templateUrl: './getting-there.page.html',
  styleUrls: ['./getting-there.page.scss'],
})
export class GettingTherePage implements OnInit {
  info : any
  constructor(
    private modalCtrl: ModalController,
    private imageModal: ImagePage,
    private gInfo  :GeneralInfoService,
    
  ) { }

  ngOnInit() {
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
  ionViewDidEnter (){
    this.gInfo.getWeddingInfoTakeOne().subscribe(data=>{
    this.info = data[0] 
    console.log(data)
  })       
}
  imageClick(post){
    var image = {
      url : post
    }
    this.imageModal.openImageModal(image,true,null,true)
  } 
  openLink(){
    var url = ``
    console.log(url)
    window.open(url, '_system');
  }
}
