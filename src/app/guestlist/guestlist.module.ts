import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from "../componenthandler/components.module"
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipe/sort/sort.pipe.module'
import { GuestlistPage } from './guestlist.page';

const routes: Routes = [
  {
    path: '',
    component: GuestlistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GuestlistPage]
})
export class GuestlistPageModule {}
