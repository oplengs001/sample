import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: 'locator', loadChildren: './locator/locator.module#LocatorPageModule' },
  { path: 'reception', loadChildren: './reception/reception.module#ReceptionPageModule' },
  { path: 'itenerary', loadChildren: './itenerary/itenerary.module#IteneraryPageModule' },
  { path: 'guestlist', loadChildren: './guestlist/guestlist.module#GuestlistPageModule' },
  { path: 'ceremony', loadChildren: './ceremony/ceremony.module#CeremonyPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
