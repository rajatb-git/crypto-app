import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { FirebaseAuthService } from './services/firebase-auth.service';
import { MarketService } from './services/market.service';
import { SharedService } from './services/shared.service';

@NgModule({
  declarations: [
    AppComponent
  ],

  entryComponents: [],

  imports: [
    //Core
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    //3rd Party
    AngularFireModule.initializeApp(environment.firebase_config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    //Custom
    AppRoutingModule
  ],

  providers: [
    //Core
    StatusBar,
    SplashScreen,
    TapticEngine,
    KeychainTouchId,
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //Custom
    FirebaseAuthService,
    MarketService,
    SharedService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
