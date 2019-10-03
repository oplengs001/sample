import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WeddingWeatherPage } from './wedding-weather.page';

const routes: Routes = [
  {
    path: '',
    component: WeddingWeatherPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WeddingWeatherPage]
})
export class WeddingWeatherPageModule {}
