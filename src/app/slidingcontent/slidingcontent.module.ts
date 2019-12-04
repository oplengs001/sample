import { NgModule ,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from "../componenthandler/components.module"
import { SlidingcontentPage } from './slidingcontent.page';
import { PipesModule } from '../pipe/sort/sort.pipe.module'
const routes: Routes = [
  {
    path: '',
    component: SlidingcontentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [SlidingcontentPage]
})
export class SlidingcontentPageModule {}
