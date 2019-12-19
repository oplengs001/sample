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
    var url = `https://www.google.com/maps/place/Jack's+Point+Golf+Course+%26+Clubhouse/@-45.0773362,168.7421554,17.71z/data=!4m13!1m7!3m6!1s0x0:0x0!2zNDXCsDA0JzM2LjciUyAxNjjCsDQ0JzI4LjciRQ!3b1!8m2!3d-45.076855!4d168.741291!3m4!1s0xa9d4dd87b0fad4bd:0xb531d6fc7fd93924!8m2!3d-45.0768642!4d168.741293`
    console.log(url)
    window.open(url, '_system');
  }
}
