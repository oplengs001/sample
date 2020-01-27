import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { FirestoreSettingsToken ,AngularFirestore  } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule, IonicRouteStrategy  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import {FCM} from '@ionic-native/fcm/ngx';
import { AutosizeModule } from 'ngx-autosize';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { AppComponent } from './app.component';
// import { FooterComponent } from './footer/footer.component'
import { AppRoutingModule } from './app-routing.module';
import { environment } from "../environments/environment"
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth/auth.service'
import { CommonModule } from '@angular/common';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Badge } from '@ionic-native/badge/ngx'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { CreateGroupPageModule } from '../app/modals/create-group/create-group.module'
import { CreateEventPageModule } from '../app/modals/create-event/create-event.module'
import { ViewingcontentPageModule } from '../app/viewingcontent/viewingcontent.module'
import { HomeMenuPageModule } from '../app/modals/menu/home-menu.module'
import { FlightMapPageModule } from '../app/modals/map/flight-map.module'
import { MessagesDetailsPageModule } from '../app/modals/messages-details/messages-details.module'
import { GettingTherePageModule } from '../app/modals/getting-there/getting-there.module'
import { DietRestPageModule } from '../app/modals/diet-rest/diet-rest.module'
import { BusReservationsPageModule } from '../app/modals/bus-reservations/bus-reservations.module'
import { GalleryPostPageModule } from '../app/modals/gallery-post/gallery-post.module'
import { ImagePageModule } from '../app/modals/photos/image/image.module'
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentsModule } from "../app/componenthandler/components.module"
import { HTTP } from '@ionic-native/http/ngx';
import {NgxImageCompressService} from 'ngx-image-compress';
import 'gl-ionic-background-video';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    ComponentsModule,
    FormsModule,   
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AutosizeModule,
    PinchZoomModule,
    NgxIonicImageViewerModule,
    CreateGroupPageModule,
    HomeMenuPageModule,
    FlightMapPageModule,
    ImagePageModule,   
    CreateEventPageModule,
    ViewingcontentPageModule,
    IonicSelectableModule,
    GettingTherePageModule,
    MessagesDetailsPageModule,
    DietRestPageModule,
    BusReservationsPageModule,
    GalleryPostPageModule
   
  ],
  providers: [

    StatusBar,
    SplashScreen,
    FCM,
    HTTP,
    File,
    AuthService,
    NativePageTransitions,
    Geolocation,
    WebView,
    SocialSharing,
    NativeGeocoder,
    Keyboard,
    FileTransfer,
    Network,
    Badge,
    ImagePicker,
    AppVersion,
    AngularFirestore,
    NgxImageCompressService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
 
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
