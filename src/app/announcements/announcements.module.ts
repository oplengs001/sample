import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from "../componenthandler/components.module"
import { AnnouncementsPage } from './announcements.page';
import { PipesModule } from '../pipe/sort/sort.pipe.module'
const routes: Routes = [
  {
    path: '',
    component: AnnouncementsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    RouterModule.forChild(routes),    
  ],
  declarations: [AnnouncementsPage]
})
export class AnnouncementsPageModule {}
