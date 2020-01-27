import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { GalleryPostPage } from './gallery-post.page';
import { PipesModule } from '../../pipe/sort/sort.pipe.module'
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
const routes: Routes = [
  {
    path: '',
    component: GalleryPostPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NgxIonicImageViewerModule,
    PinchZoomModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GalleryPostPage]
})
export class GalleryPostPageModule {}
