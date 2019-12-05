import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from "../componenthandler/components.module"
import { IonicModule } from '@ionic/angular';

import { MessagesPage } from './messages.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
const routes: Routes = [
  {
    path: '',
    component: MessagesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NgxIonicImageViewerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
