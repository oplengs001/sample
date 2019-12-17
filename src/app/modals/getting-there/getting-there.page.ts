import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { ImagePage } from '../photos/image/image.page'
@Component({
  selector: 'app-getting-there',
  templateUrl: './getting-there.page.html',
  styleUrls: ['./getting-there.page.scss'],
})
export class GettingTherePage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private imageModal: ImagePage
  ) { }

  ngOnInit() {
  }
  async closeModal() {  
    await this.modalCtrl.dismiss();
  }
  imageClick(post){
    var image = {
      url : post
    }
    this.imageModal.openModal(image,true)
  } 
  openLink(){
    var url = 'https://www.google.com/maps/search/?api=1&query=-45.076855,168.741291'
    console.log(url)
    window.open(url, '_system');
  }
}
