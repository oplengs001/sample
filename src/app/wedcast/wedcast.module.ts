import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WedcastPage } from './wedcast.page';
import { ComponentsModule } from '../componenthandler/components.module';

const routes: Routes = [
  {
    path: '',
    component: WedcastPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [WedcastPage]
})
export class WedcastPageModule {}
