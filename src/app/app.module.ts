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
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { CreateGroupPageModule } from '../app/modals/create-group/create-group.module'
import { HomeMenuPageModule } from '../app/modals/menu/home-menu.module'
import { ComponentsModule } from "../app/componenthandler/components.module"
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
    CreateGroupPageModule,
    HomeMenuPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    AuthService,
    NativePageTransitions,
    Geolocation,
    WebView,
    NativeGeocoder,
    ImagePicker,
    AppVersion,
    AngularFirestore,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
 
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
