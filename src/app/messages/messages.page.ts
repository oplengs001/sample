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
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})

export class MessagesPage implements OnInit {  
  private ThisChat = new Subscription()
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChildren('messages') things: QueryList<any>;

  chat$: Observable<any>;
  public newMsg: string; 
  currentUser :string;  
  id: any;
  limit:number
  current_index :number
  current_length :number  
  hide_scroll:boolean
  text_value:boolean
  temp_image : string
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
  ) {    
    this.route.queryParams.subscribe(params => {
      this.id = params["group_id"];      
    });
  }

  ngOnInit(){
 
  }
  ngAfterViewInit(){  
    // this.things.changes.subscribe(t => {                  
    // })     
  }  
  loadData(event) {      
    setTimeout(() => {         
      if(this.current_length !== undefined){          
          
          this.limit = this.limit + 10
          if ( this.limit >= this.current_length) {          
            this.current_index = 0         
            this.infiniteScroll.disabled = true
            this.hide_scroll = true    
            this.limit = this.current_length
            
          }else{
            this.current_index = this.current_length-this.limit                       
            this.infiniteScroll.complete()  
          }                 
      }else{
        this.infiniteScroll.complete()
      }           
    }, 1000);
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
    this.ThisChat.unsubscribe()
    this.current_index = undefined
    this.current_length = undefined
    this.limit = undefined
  }
  ionViewDidEnter (){    
    this.seen_chat()     
    this.newMsg = ""
    this.temp_image = ""
    console.table({
      c_index : this.current_index,
      limit : this.limit,
      current_length : this.current_length
    }) 
    this.currentUser = this.auth.currentUserId()
    this.hide_scroll = false    
    this.limit = 10
    console.log("did enter")
    this.infiniteScroll.disabled = false  
    
    this.cs.joinUsers(this.cs.get(this.id)).then(data=>{
      this.chat$ = data      
      this.scrollToBottom(500)   
      // this.scrollToBottom(500)
      this.ThisChat = data.subscribe(data=>{
        console.log(data)
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
              this.scrollToBottom(500)   
            }
          } 
          this.current_index = this.current_length-this.limit  
        }
         
      })         
    });  
  }

  submit(event,chatId,group_name) {       
    event.preventDefault()
    var message = this.newMsg
      if(this.newMsg === '' || this.newMsg.length === 0 || !message.replace(/\s/g, '').length ){
 
      }else{
        
        this.newMsg = this.newMsg.trim();
        this.cs.sendMessage(chatId, group_name,this.newMsg,this.temp_image).then(data=>{
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
    const loading = await this.loadingCtrl.create({
      message: 'Saving Image',     
    });
    await loading.present();
    // var image = "/assets/images/Itinerary/arrival.jpg"
    this.imageCompress.compressFile(image,-1,50,50).then(res=>{
      this.imageService.saveAppGalleryRef(res,"chat-images").then(photo => {    
        this.temp_image = photo.url
        loading.dismiss()      
      })
    })
  }
  gotoGroups(){
    
  }
  trackByCreated(i, msg) {    
    
    return msg.createdAt;
  }

}
