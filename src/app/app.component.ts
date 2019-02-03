import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { SharedService } from './services/shared.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  user: UserModel = new UserModel();

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Top Cryptocurrencies',
      url: '/list',
      icon: 'trending-up'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sService: SharedService,
    private fAuthService: FirebaseAuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.user = this.sService.loggedInUser;
      this.sService.loggedInUser.subscribe(value => {
        if (!value.id) {
          this.fAuthService.getUserDetails().then(res => {
            this.user = res;
          });
        } else {
          this.user = value;
        }
      });
    });
  }
}
