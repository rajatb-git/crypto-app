import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';

import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: any;
  errorMsg: string = "";
  isPlatformIos: boolean = false;

  constructor(
    private fAuthService: FirebaseAuthService,
    private taptic: TapticEngine,
    private toastCtrl: ToastController,
    private router: Router,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.isPlatformIos = this.platform.is('ios') && this.platform.is('cordova');

    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  validateSubmit(): boolean {
    if (this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password) {
      return true;
    }

    return false;
  }

  doSignup() {
    if (!this.validateSubmit()) return;

    this.fAuthService.doSignup(this.signupForm.value).then(response => {
      this.showToast("Registered Successfully!", false);

      if (this.isPlatformIos) {

      }

      this.router.navigate(["/login"]);
    }).catch(error => {
      this.errorMsg = error.message;
      this.showToast('Error occured!', true);
    });
  }

  async showToast(message: string, error: boolean) {
    if (error) {
      this.taptic.notification({
        type: "error"
      });
    } else {
      this.taptic.notification({
        type: "success"
      });
    }

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

  goToLogin() {
    this.router.navigate(['/login']);
  }

  reset(): void {
    this.errorMsg = "";
  }

}
