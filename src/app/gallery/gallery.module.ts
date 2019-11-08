import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GalleryPage } from './gallery.page';
import { PipesModule } from '../pipe/sort/sort.pipe.module'
const routes: Routes = [
  {
    path: '',
    component: GalleryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GalleryPage]
})
export class GalleryPageModule {}
