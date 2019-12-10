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
  { path: 'guestlist', loadChildren: './guestlist/guestlist.module#GuestlistPageModule' },
  { path: 'ceremony', loadChildren: './ceremony/ceremony.module#CeremonyPageModule' },
  { path: 'guestadd', loadChildren: './guestadd/guestadd.module#GuestaddPageModule' }, 
  { path: 'announcements', loadChildren: './announcements/announcements.module#AnnouncementsPageModule' },
  { path: 'admin-announcement', loadChildren: './admin-announcement/admin-announcement.module#AdminAnnouncementPageModule' },
  { path: 'admin-messaging', loadChildren: './admin-messaging/admin-messaging.module#AdminMessagingPageModule' },
  { path: 'messages', loadChildren: './messages/messages.module#MessagesPageModule' },
  { path: 'gallery', loadChildren: './gallery/gallery.module#GalleryPageModule' },
  { path: 'create-group', loadChildren: './modals/create-group/create-group.module#CreateGroupPageModule' },
  { path: 'message-list', loadChildren: './message-list/message-list.module#MessageListPageModule' },
  { path: 'home-tab', loadChildren: './home-tab/home-tab.module#HomeTabPageModule' },
  { path: 'weather', loadChildren: './weather/weather.module#WeatherPageModule' },
  { path: 'slidingcontent', loadChildren: './slidingcontent/slidingcontent.module#SlidingcontentPageModule' },
  { path: 'viewingcontent', loadChildren: './viewingcontent/viewingcontent.module#ViewingcontentPageModule' },
  { path: 'home-menu', loadChildren: './modals/menu/home-menu.module#HomeMenuPageModule' },
  { path: 'visas', loadChildren: './pre-wedding/visas/visas.module#VisasPageModule' },
  { path: 'getting-there', loadChildren: './pre-wedding/getting-there/getting-there.module#GettingTherePageModule' },
  { path: 'accomodations', loadChildren: './pre-wedding/accomodations/accomodations.module#AccomodationsPageModule' },
  { path: 'rentals', loadChildren: './pre-wedding/rentals/rentals.module#RentalsPageModule' },
  { path: 'wedding-weather', loadChildren: './pre-wedding/wedding-weather/wedding-weather.module#WeddingWeatherPageModule' },
  { path: 'flight-map', loadChildren: './modals/map/flight-map.module#FlightMapPageModule' },
  { path: 'image', loadChildren: './modals/photos/image/image.module#ImagePageModule' },
  { path: 'create-event', loadChildren: './modals/create-event/create-event.module#CreateEventPageModule' },
  { path: 'rsvp', loadChildren: './rsvp/rsvp.module#RsvpPageModule' },
  { path: 'rsvp-list', loadChildren: './pre-wedding/rsvp-list/rsvp-list.module#RsvpListPageModule' },
  { path: 'rsvp-admin', loadChildren: './rsvp/rsvp-admin/rsvp-admin.module#RsvpAdminPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
