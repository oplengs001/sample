import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { ActionClass } from '../../gallery-action-sheet/actionsheet'
import { ImagesService  } from "../../services/uploads/images.service"
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import { SlidingContentService, Itinerary } from "../../services/content/sliding-content.service"
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Observable, scheduled } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../../services/toaster/toast-service';
import { NotificationService } from "../../services/alerts/notification.service"
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
  event_schedule : string;
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
    public loadingController: LoadingController,
    private notif : NotificationService,   
  ) { 

    this.createGroupForm();

  }
  createGroupForm() {
    this.GroupForm = this.fb.group({
      event_name: ['', Validators.required],
      event_location: ['', Validators.required],
      event_schedule : ['', Validators.required],
    });
  }
  addEvent (formValues) {    
    var {event_name , event_location ,event_schedule} = formValues.value
    let message = `Your about to create this Event`
    this.actions.confirmationMessage(message).then(res=>{
      if(!res){
        return null
      }
      var eventItem = {
        image_url : this.temp_image,
        image_ref : this.temp_image_ref,
        name : event_name,
        location : event_location,
        position : this.event_last_position+1,
        schedule : event_schedule
      }
      this.contentService.addEvent(<Itinerary>eventItem).then((data)=>{
        this.actions.customAlert("Sucess","Event Added")
        console.log(event_name)
        console.log(data)
        this.notif.ItineraryNotif("New Event on the Itinerary!",event_name)
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
            disable_popover : true,
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
  async uploadImageToFirebase(image?){
    image = this.webview.convertFileSrc(image);       
    const loading = await this.loadingController.create({
      message: 'Saving Image',     
    });
    await loading.present();
    //  image = "/assets/images/itenerary/arrival.jpg"    
    this.imageService.saveAppGalleryRef(image,"app-gallery").then(photo => {    
      this.temp_image = photo.url           
      this.temp_image_ref = photo.file_name
      loading.dismiss()
      
    })
  }
  ngOnInit() {
    
  }
  selectImage(){
    
    this.temp_image = "/assets/images/Itinerary/arrival.jpg"
  }
  async closeModal() {  
    await this.modalController.dismiss();
  }
}
