import { Component, OnInit ,Injectable} from '@angular/core';
import { ModalController } from '@ionic/angular';

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
  constructor(
    private modalctrl: ModalController,    
  ) { }

  ngOnInit() {
  }
  customImageLoaded(event,isLoaded: boolean) {    
    if (isLoaded) {
      // setTimeout(() => {                
        event.target.parentElement.parentElement.classList.add('img-loaded');
      // }, 500);      
    } else {
        event.target.parentElement.parentElement.classList.remove('img-loaded');
    }
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
