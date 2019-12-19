import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { ChatService} from '../../services/chat/chat.service'
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import { GuestAddService ,Guest} from '../../services/guest-add/guest-add.service'
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toaster/toast-service';
import  {ActionClass } from '../../gallery-action-sheet/actionsheet'
import { AuthService } from '../../services/auth/auth.service';
import { IonicSelectableComponent } from 'ionic-selectable';
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
})
export class CreateGroupPage implements OnInit {
  GroupForm: FormGroup;
  group_details :any
  group_array = [];
  original_array = [];
  guests_array = [];
  SavingModal : boolean
  EditingModal : boolean
  private guests: Observable<Guest[]>;
  
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private ChatServ : ChatService,
    private GuestServ : GuestAddService,
    private AuthServ : AuthService,
    private actions : ActionClass,
    private toastService : ToastService
) {   
      this.createGroupForm();
    
  }
  ngOnInit() {
      
  } 
  ionViewDidEnter (){     
    this.AuthServ.getAllUsers().then(data=>{
      data = data.map(user=>{
        return {...user, full_name : `${user.first_name} ${user.last_name}`}
      })
      this.guests_array = data
      console.log(data)
    })

    if(!this.EditingModal){     
      let {inbox} = this.group_details
      for(var i in inbox){            
        let user = inbox[i]            
         this.AuthServ.getUserDataByID(user.user_id).then((data=>{
    
          if(data){
            data.full_name = `${data.first_name} ${data.last_name}`
            this.group_array.push(data)
            this.original_array.push(data)
          }

          console.log(this.group_array)
        }))         
      }
      this.GroupForm.controls['group_id'].setValue(this.group_details.id);
      this.GroupForm.controls['group_name'].setValue(this.group_details.group_name);
    } 
  }
  membersChange(
  event: {
    component: IonicSelectableComponent,
    value: any 
  }){}
  createGroupForm() {
    this.GroupForm = this.fb.group({
      group_id: ['', Validators.required],
      group_name: ['', Validators.required],
    });
  }

  addGroup (formValues){      
    if(this.group_array.length===0){
      this.actions.customAlert("Warning","Please Add Guests In the Group")
      return null
    }
    let forEdit = false,
    key_message = "Created"    
    if(!this.EditingModal){ 
      key_message = "Update"
      forEdit=true
    }
    let message = `Your about to ${key_message} this Group`
    this.actions.confirmationMessage(message).then(res=>{
      if(!res){
        return null
      }      
      let original = this.original_array,
      new_array = this.group_array,
      reduced_array =[], 
      {value}= formValues,
      {group_name , group_id } = value,    
      chat_group = {
        group_id : group_id,
        group_name : group_name
      },group_members = this.group_array.map(data=>{
        return data.uid
      })
      
      if(forEdit){ 
        forEdit = true
        let unique = original.filter((o)=> new_array.indexOf(o) === -1),
        removed_chat_ids = unique.map(item=>{
          var {chat_id} = item;
          item.chat_id = this.remItem(chat_id,group_id)
          return item    
        })
      
        reduced_array = removed_chat_ids.map(item => {
          return {
            uid : item.uid,
            chat_id : item.chat_id
          }
        })
    
      }
      console.log(group_members)     
      console.log(reduced_array)        
      this.GuestServ.addGroupToGuestMultiple(group_id , group_members,reduced_array).then(data=>{
        this.ChatServ.create(chat_group,group_members,forEdit).then(data=>{
          if(forEdit){
            console.log(reduced_array)
            this.toastService.showToast('Group Updated!');
            this.actions.customAlert("Success!","Group Updated!")
          }else{
            this.toastService.showToast('Group Created!');
            this.actions.customAlert("Success!","Group Created!")
            this.closeModal()
          }
         
        })
      }) 
    })   
  }
  async closeModal() {  
    await this.modalController.dismiss();
  }
  remItem(arr, val) {
    for (var i = 0; i < arr.length; i++) if (arr[i] === val) arr.splice(i, 1);
    return arr;
  }


}
