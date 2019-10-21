import { Component, OnInit,Injectable } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { ActionClass} from '../../../gallery-action-sheet/actionsheet'
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class ImagePage implements OnInit {
  image_post : any;
  constructor(
    
    private modalctrl: ModalController,    
    private actions : ActionClass
    ) { }

  ngOnInit() {
  }
  async closeModal() {  
    await this.modalctrl.dismiss();
  }
  async openModal(post:any) {
      const modal: HTMLIonModalElement =
      await this.modalctrl.create({
         component: ImagePage,     
         componentProps:{
           image_post : post
         }
      });          
      await modal.present();  
  }

}
