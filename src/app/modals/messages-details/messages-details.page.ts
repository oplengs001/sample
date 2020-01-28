import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { AuthService } from "../../services/auth/auth.service"
import { CreateGroupPage } from '../../modals/create-group/create-group.page';
import { ImagePage } from '../photos/image/image.page'
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-messages-details',
  templateUrl: './messages-details.page.html',
  styleUrls: ['./messages-details.page.scss'],
})
export class MessagesDetailsPage implements OnInit {
  group_details :any
  group_for_edit: any
  isAdmin : boolean
  members : any
  constructor(
    private modalController: ModalController,
    private auth : AuthService,    
    private imageModal: ImagePage
  ) { }

  ngOnInit() {    
    
    this.isAdmin = this.auth.isAdmin()  
  }  
  async editGroup() {
    this.closeModal()

    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: CreateGroupPage,
          componentProps: {
            group_details :this.group_for_edit, 
            SavingModal : true,
            EditingModal : false,
            aParameter: true,
            otherParameter: new Date()
          }
    });          
    await modal.present();
  }
  async closeModal() {  
    await this.modalController.dismiss();
  }
  imageClick(post){
    this.imageModal.openImageModal(post,true,null,true)
  } 
}
