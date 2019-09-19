import { Component, OnInit } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { ChatService} from '../../services/chat/chat.service'
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { GuestAddService ,Guest} from '../../services/guest-add/guest-add.service'
import { Observable } from 'rxjs';
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
})
export class CreateGroupPage implements OnInit {
  GroupForm: FormGroup;
  group_details :{
    group_id : string,
    group_name : string,
    group_members : []
  }
  private guests: Observable<Guest[]>;
  
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private ChatServ : ChatService,
    private GuestServ : GuestAddService
  ) {   
      this.createGroupForm();
  }
  ngOnInit() {
    this.guests = this.GuestServ.getGuests();

  }
  createGroupForm() {
    this.GroupForm = this.fb.group({
      group_id: ['', Validators.required],
      group_name: ['', Validators.required],
      group_members:[[],Validators.required]
    });
  }

  addGroup (formValues){
    var {value}= formValues    
    var {group_name , group_id , group_members} = value
    var chat_group = {
      group_id : group_id,
      group_name : group_name
    }    
    this.GuestServ.addGroupToGuestMultiple(group_id , group_members).then(data=>{
      this.ChatServ.create(chat_group)
    })
    
  }
  async closeModal() {  
    await this.modalController.dismiss();
  }

}
