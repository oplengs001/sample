import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipe/sort/sort.pipe.module'
import { RsvpListPage } from './rsvp-list.page';

const routes: Routes = [
  {
    path: '',
    component: RsvpListPage
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
  declarations: [RsvpListPage]
})
export class RsvpListPageModule {}
