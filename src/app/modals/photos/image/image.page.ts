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
  hideFooter : boolean;
  hideDelete : boolean
  current_user : string
  constructor(
    
    private modalctrl: ModalController,    
    private actions : ActionClass
    ) { }

  ngOnInit() {
  }
  async closeModal() {  
    await this.modalctrl.dismiss();
  }
  async openImageModal(
    post:any,
    hideFooter?:boolean,
    currentUser?:string,
    hideDelete?:boolean
    
    ) {

      const modal: HTMLIonModalElement =
      await this.modalctrl.create({
         component: ImagePage,     
         componentProps:{
           image_post : post,
           hideFooter : hideFooter,
           current_user : currentUser,
           hideDelete : hideDelete
         },
         cssClass:"customModalClass",
      });          
      await modal.present();  
  }

}
