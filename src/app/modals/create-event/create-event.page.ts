import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { ActionClass } from '../../gallery-action-sheet/actionsheet'
import { ImagesService  } from "../../services/uploads/images.service"
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import { SlidingContentService, Itenerary } from "../../services/content/sliding-content.service"
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../../services/toaster/toast-service';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  GroupForm: FormGroup;
  temp_image : string;
  temp_image_ref : string;
  event_name : string;
  event_location : string
  event_last_position : number
  constructor(
    private modalController: ModalController,
    private actions : ActionClass,
    private imagePicker : ImagePicker,
    private webview : WebView,
    private imageService : ImagesService,
    private toastService : ToastService,
    private contentService : SlidingContentService,
    private fb: FormBuilder,
    public loadingController: LoadingController

  ) { 

    this.createGroupForm();

  }
  createGroupForm() {
    this.GroupForm = this.fb.group({
      event_name: ['', Validators.required],
      event_location: ['', Validators.required],
    });
  }
  addEvent (formValues) {    
    var {event_name , event_location} = formValues.value
    let message = `Your about to Create this Event`
    this.actions.confirmationMessage(message).then(res=>{
      if(!res){
        return null
      }
      var eventItem = {
        image_url : this.temp_image,
        image_ref : this.temp_image_ref,
        name : event_name,
        location : event_location,
        position : this.event_last_position+1
      }
      this.contentService.addEvent(<Itenerary>eventItem).then(()=>{
        this.actions.customAlert("Sucess","Event Added")
        this.closeModal()
      })
    })
  }
  openImagePicker(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
    });
  }
  // uploadImageToFirebase(image){
  async uploadImageToFirebase(image){
    image = this.webview.convertFileSrc(image);       
    const loading = await this.loadingController.create({
      message: 'Saving Image',     
    });
    await loading.present();
    // var image = "/assets/images/itenerary/arrival.jpg"    
    this.imageService.saveAppGalleryRef(image,"app-gallery").then(photo => {    
      this.temp_image = photo.url           
      this.temp_image_ref = photo.file_name
      loading.dismiss()
      
    })
  }
  ngOnInit() {
    
  }
  selectImage(){
    
    this.temp_image = "/assets/images/itenerary/arrival.jpg"
  }
  async closeModal() {  
    await this.modalController.dismiss();
  }
}
