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
  { path: 'locator', loadChildren: './locator/locator.module#LocatorPageModule' },
  { path: 'reception', loadChildren: './reception/reception.module#ReceptionPageModule' },
  { path: 'itenerary', loadChildren: './itenerary/itenerary.module#IteneraryPageModule' },
  { path: 'guestlist', loadChildren: './guestlist/guestlist.module#GuestlistPageModule' },
  { path: 'ceremony', loadChildren: './ceremony/ceremony.module#CeremonyPageModule' },
  { path: 'guestadd', loadChildren: './guestadd/guestadd.module#GuestaddPageModule' },
  { path: 'announcements', loadChildren: './announcements/announcements.module#AnnouncementsPageModule' },
  { path: 'admin-announcement', loadChildren: './admin-announcement/admin-announcement.module#AdminAnnouncementPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
