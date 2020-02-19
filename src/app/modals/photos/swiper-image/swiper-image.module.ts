import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SwiperImagePage } from './swiper-image.page';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { PipesModule } from '../../../pipe/sort/sort.pipe.module'

const routes: Routes = [
  {
    path: '',
    component: SwiperImagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinchZoomModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SwiperImagePage]
})
export class SwiperImagePageModule {}
