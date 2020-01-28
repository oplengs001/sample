import { Component, OnInit ,Injectable} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImagePage } from '../photos/image/image.page';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-gallery-post',
  templateUrl: './gallery-post.page.html',
  styleUrls: ['./gallery-post.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class GalleryPostPage implements OnInit {
  private image_post: any
  private currentUser : string
  constructor(
    private modalctrl: ModalController,    
    private imageModal: ImagePage,
    private authServ : AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authServ.currentUserId();
  }
  imageLoaded(event,isLoaded: boolean) {    
    if (isLoaded) {
      // setTimeout(() => {        
        
        event.target.parentElement.classList.add('img-loaded');
      // }, 500);
    } else {
        event.target.parentElement.classList.remove('img-loaded');
    }
  }
  imageClick(post){
    this.imageModal.openImageModal(
      post,
      false,
      this.currentUser,
      false
    )
  }
  async closeModal() {  
    await this.modalctrl.dismiss();
  }
  async openModal(post:any,hideFooter?:boolean) {

      const modal: HTMLIonModalElement =
      await this.modalctrl.create({
         component: GalleryPostPage,     
         componentProps:{
           image_post : post,
           hideFooter : hideFooter
         },
         cssClass:"customModalClass",
      });          
      await modal.present();  
  }
}