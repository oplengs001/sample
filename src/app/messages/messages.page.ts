import { Component, OnInit ,ViewChild , ViewChildren ,QueryList} from '@angular/core';
import { IonContent,IonInfiniteScroll  ,IonTextarea } from '@ionic/angular';
import { ChatService } from '../services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable,Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { FooterComponent} from '../footer/footer.component'
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImagesService  } from "../services/uploads/images.service";
import { LoadingController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { throttleTime } from 'rxjs/operators';
import { ToastService } from '../services/toaster/toast-service';
import { Platform } from '@ionic/angular';
import { ModalController, } from '@ionic/angular';
import { MessagesDetailsPage } from "../modals/messages-details/messages-details.page"
import { GuestAddService} from "../services/guest-add/guest-add.service"
import { ImagePage } from "../modals/photos/image/image.page"
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})

export class MessagesPage implements OnInit {  
  private ThisChat = new Subscription()
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChildren('messages') messages: QueryList<any>;

  chat$: Observable<any>;
  public newMsg: string; 
  currentUser :string;  
  id: any;
  limit:number
  current_index :number
  current_group : any
  current_length :number  
  current_images : any
  current_members : any
  hide_scroll:boolean
  text_value:boolean
  temp_image : string
  temp_image_frb : string
  hide_image : boolean
  uploading: boolean
  device_platform : string
  scrollThreshold : string
  gcName : string
  private first_line = true
  constructor(
    public cs: ChatService,
    public auth : AuthService,
    private route: ActivatedRoute,
    private footerFunc : FooterComponent,
    private imageCompress: NgxImageCompressService,
    private imagePicker : ImagePicker,
    private loadingCtrl : LoadingController,
    private imageService : ImagesService,
    private webview : WebView,
    private toaster : ToastService,
    private platform : Platform,
    private modalctrl : ModalController,
    private guest : GuestAddService,
    private imageModal: ImagePage
  ) {    
  
  }

  ngOnInit(){
    // this.temp_image_css = "sent-img"
    if(this.platform.is("ios")){
      this.device_platform = "ios"
      this.scrollThreshold = "50px"
    }else{
      this.device_platform = "android"
      this.scrollThreshold = "30%"
    }
  }
  ngAfterViewInit(){  
    this.route.queryParams.subscribe(params => {
      this.id = params["group_id"];        
      this.showChat()    
    });  
    // this.messages.changes.pipe(throttleTime(500))
  }  
  loadData(event) {      
    console.log("called")
    
    if(this.device_platform === "ios"){
      setTimeout(() => {
        this.loadDataTimeout()
      }, 1000);
    }else{
      this.loadDataTimeout()
    }
   
  }
  loadDataTimeout(){
    
  if(this.current_length !== undefined){          
          
      this.limit = this.limit + 15
      if ( this.limit >= this.current_length) {          
        this.current_index = 0         
        this.infiniteScroll.disabled = true
        this.hide_scroll = true    
        this.limit = this.current_length
        
      }else{

        this.current_index = this.current_length-this.limit                       
        this.infiniteScroll.complete()
        this.first_line = false
      }                 
    }else{
      
      this.infiniteScroll.complete()
    } 
  }
  scrollToBottom(value) {
    setTimeout(()=>{   
      this.content.scrollToBottom(value);
    },150)
  }
  ionViewWillEnter() {
   
  }
  seen_chat(){
    this.cs.seen_chat(this.id).then(seen =>{        
      if(seen.continue){
        this.footerFunc.SubrcibeToOwnTopics()
        this.footerFunc.ClearNotifs(seen.count)
      }else{

      }
    })
  }
  ionViewDidLeave(){
    // this.current_length   
 
  }
  ionViewDidEnter (){ 
    
  }
  imageClick(post){
    var image_post={
        url:post
    }
    this.imageModal.openModal(image_post,true)
  } 
  showChat(){
    console.log("ca")
    this.emptyChat()
    this.currentUser = this.auth.currentUserId()
    this.seen_chat()   
    this.cs.joinUsers(this.cs.get(this.id)).then(data=>{
      this.chat$ = data      
 
      // this.scrollToBottom(0)   
      // this.scrollToBottom(500)
      
      this.ThisChat = data.subscribe(data=>{    
          
        this.gcName = data.group_name        
        this.current_images = data.images.reverse()
        this.current_group = data
        this.getMembers(data)
        if(this.id == data.id){
          let from_seen = false
          if(this.current_length === data.messages.length){
            from_seen = true
          }
          this.current_length = data.messages.length 
          
          if(this.current_length <=8){
            this.infiniteScroll.disabled = true    
            this.hide_scroll = true
            this.limit = this.current_length
          }else{
          
            if(!from_seen){
              this.limit++
              this.infiniteScroll.disabled = false    
              this.hide_scroll = false  
              this.scrollToBottom(0)   
            }else{
              this.scrollToBottom(500)
            }
          } 
          this.current_index = this.current_length-this.limit  
        }
         
      })         
    }); 
  }
  emptyChat(){
    this.ThisChat.unsubscribe()
    this.current_index = undefined
    this.current_length = undefined
    this.current_images = undefined
    this.current_members = undefined
    this.limit = undefined
    this.temp_image = ""
    this.hide_image = true
    this.uploading = false
    
    this.newMsg = ""
    this.temp_image =""
    this.hide_image = true
    this.hide_scroll = false    
    this.limit = 25
    this.infiniteScroll.disabled = false  
    this.first_line = true
    this.gcName = ""

  }
  submit(event,chatId,group_name) {       
    event.preventDefault()
    var message = this.newMsg
      if(this.newMsg === '' || this.newMsg.length === 0 || !message.replace(/\s/g, '').length ){
        if(!this.hide_image){
          this.cs.sendMessage(chatId, group_name,this.newMsg,this.temp_image).then(data=>{
            this.hide_image = true
            this.newMsg = ''
            this.seen_chat()
            this.temp_image = ''
            // this.scrollToBottom(500)
          }); 
        }
     
      }else{
        
        this.newMsg = this.newMsg.trim();
        this.cs.sendMessage(chatId, group_name,this.newMsg,this.temp_image).then(data=>{
          this.hide_image = true
          this.newMsg = ''
          this.seen_chat()
          this.temp_image = ''
          // this.scrollToBottom(500)
        });   
      }
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
            maximumImagesCount: 1,
            quality : 15,            
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
  async uploadImageToFirebase(image){
    
    image = this.webview.convertFileSrc(image);           
    this.toaster.showToast("Please wait")
    // var image = "assets/images/itenerary/sf5MXmIzXd.jpg"
    this.hide_image = false
    this.temp_image = image
    this.temp_image_frb = "imageloading md hydrated"
    this.uploading = true
    this.newMsg = " "
    this.imageCompress.compressFile(image,-1,50,50).then(res=>{
      this.imageService.saveChatGallery(res,"chat-images").then(photo => {        
        this.temp_image = photo.url      
        this.hide_image = false
        this.uploading = false
        this.temp_image_frb = "imageloaded md hydrated"
        this.toaster.showToast("image ready")   
      })
    })
  }

  imageLoaded(event,isLoaded: boolean,index) {    
    if (isLoaded) {
      // setTimeout(() => {                
        //  
      if(this.first_line){      
        if(this.limit >= index &&  index >= this.limit-5){
          this.scrollToBottom(0)          
        }    
      }      
        event.target.parentElement.classList.add('img-loaded');
      // }, 500);      
    } else {
        event.target.parentElement.classList.remove('img-loaded');
    }
  }
  gotoGroups(){
    
  }
  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }  
  async openDetails() {    
    const modal: HTMLIonModalElement =
      await this.modalctrl.create({
          component: MessagesDetailsPage,
          componentProps: {
            group_details:{
              members : this.current_members,
              images:this.current_images,
              gcName : this.gcName
            },       
            group_for_edit : this.current_group,     
            aParameter: true,
          }
    });          
    await modal.present();
  }
  getMembers(group){
    this.current_members = []
    var {inbox} = group
        inbox.map((member)=>{
        this.guest.getGuestSingle(member.user_id).then(data=>{
            this.current_members.push(data)
        })
     
      })
    
  } 

}
