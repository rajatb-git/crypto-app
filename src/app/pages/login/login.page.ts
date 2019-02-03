import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: any;
  errorMsg: string = "";
  loading: any = null;
  isPlatformCordova: boolean = false;

  constructor(
    private fAuthService: FirebaseAuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private taptic: TapticEngine,
    private keychainTouch: KeychainTouchId,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {

    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required]))
    });

    await this.fAuthService.isLoggedIn().then(res => {
      if(res) {
        this.router.navigate(['/home']);
      }
    });

    this.isPlatformCordova = this.platform.is('cordova');

    if (this.isPlatformCordova) {
      this.nativeStorage.getItem('email').then(res => {
        this.loginForm.value.email = res;
        console.log(res);
        this.loadTouchId(res);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  async loadTouchId(user: any) {

    if (!this.loginForm.value.email) {
      this.loginForm.value.email = this.nativeStorage.getItem('email');
    }

    await this.keychainTouch.verify(this.loginForm.value.email, "Touch ID to login").then(res => {
      this.taptic.selection();
      this.loginForm.value.password = res;

      this.doTouchIDLogin();
    }).catch(error => {
      console.log(error);
    });
  }

  async doTouchIDLogin() {
    try {
      if (!this.validateLogin()) {
        this.reset();
        return;
      }

      this.showLoading();

      await this.fAuthService.doLogin(this.loginForm.value).then(async response => {
        this.tapticNotification('success');
        this.router.navigate(['/home']);
      }).catch(error => {
        this.tapticNotification('error');

        this.reset();
        this.errorMsg = "Wrong email / password!";
      });
    }
    catch (error) {

    }
    finally {
      this.removeLoading();
    }
  }

  async showToast(message: string) {
    this.taptic.notification({
      type: "error"
    });

    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok',
      duration: 5000,
      color: 'danger',
      animated: true
    });
    toast.present();
  }

  validateLogin(): boolean {
    if (this.loginForm.value.email && this.loginForm.value.password) {
      return true;
    }

    return false;
  }

  reset(): void {
    this.errorMsg = "";
  }

  async doLogin() {
    try {
      if (!this.validateLogin()) {
        this.reset();
        return;
      }

      this.showLoading();

      await this.fAuthService.doLogin(this.loginForm.value).then(async response => {

        await this.keychainTouch.isAvailable().then(async res => {
          var alert = await this.alertCtrl.create({
            header: 'Confirm!',
            message: 'Do you want to enable touch ID login?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                  console.log('Confirm Cancel: blah');
                }
              }, {
                text: 'Okay',
                handler: () => {
                  this.nativeStorage.setItem('email', this.loginForm.value.email);
                  this.keychainTouch.save(this.loginForm.value.email, this.loginForm.value.password);
                }
              }
            ]
          });

          await alert.present();
        }).catch(error => {
          // this.showToast(error.message);
        });

        this.router.navigate(['/home']);
      }).catch(error => {
        this.tapticNotification('error');

        this.reset();
        this.errorMsg = "Wrong email / password!";
      });
    }
    catch (error) {

    }
    finally {
      this.removeLoading();
    }
  }

  async showLoading() {
    if (!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message: 'Loading...',
        animated: true,
        spinner: 'dots'
      });
      await this.loading.present();
    }
  }

  tapticNotification(type: any) {
    if (!this.isPlatformCordova) return;

    this.taptic.notification({
      type: type
    });
  }

  async removeLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  async showEnableTouchIDAlert(data: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Do you want to enable touch ID login?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.nativeStorage.setItem('email', this.loginForm.value.email);
            this.keychainTouch.save(this.loginForm.value.email, this.loginForm.value.password);
          }
        }
      ]
    });

    await alert.present();
  }

}
