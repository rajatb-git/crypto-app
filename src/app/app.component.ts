import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { SharedService } from './services/shared.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

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
    },
    {
      title: 'Crypto News',
      url: '/news-list',
      icon: 'book'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sService: SharedService,
    private fAuthService: FirebaseAuthService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.initializeApp();
  }

  ngOnDestroy() {
    if (this.platform.is('cordova')) {
      this.fAuthService.doLogout();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        this.fAuthService.doLogout();
      }

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

  async doLogout() {
    await this.fAuthService.doLogout();
    this.router.navigate(['/login']);
  }
}
