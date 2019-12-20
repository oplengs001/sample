import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CeremonyPage } from './ceremony.page';
import { PipesModule } from '../pipe/sort/sort.pipe.module'
const routes: Routes = [
  {
    path: '',
    component: CeremonyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [CeremonyPage]
})
export class CeremonyPageModule {}
