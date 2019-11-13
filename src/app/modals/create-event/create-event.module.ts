import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateEventPage } from './create-event.page';

const routes: Routes = [
  {
    path: '',
    component: CreateEventPage
  }
];

@NgModule({
  declarations: [CreateEventPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ CreateEventPage ],

})
export class CreateEventPageModule {}
