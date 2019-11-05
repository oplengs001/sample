import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { CreateGroupPage } from './create-group.page';

const routes: Routes = [
  {
    path: '',
    component: CreateGroupPage
  }
];

@NgModule({
  declarations: [CreateGroupPage],
  imports: [
    CommonModule,
    IonicSelectableModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ CreateGroupPage ]
})
export class CreateGroupPageModule {}
