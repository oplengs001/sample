import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RsvpAdminPage } from './rsvp-admin.page';

const routes: Routes = [
  {
    path: '',
    component: RsvpAdminPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RsvpAdminPage]
})
export class RsvpAdminPageModule {}
