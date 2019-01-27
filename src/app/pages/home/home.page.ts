import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MarketService } from '../../services/market.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { SharedService } from '../../services/shared.service';

import { UserPopoverPage } from '../user-popover/user-popover.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  cryptoForm: FormGroup = new FormGroup({
    symbol: new FormControl('', Validators.compose([Validators.required])),
    convert: new FormControl('', Validators.compose([Validators.required]))
  });
  errorMsg: string = null;
  result: any = null;
  loading: any = null;

  constructor(
    private marketService: MarketService,
    private loadingCtrl: LoadingController,
    private taptic: TapticEngine,
    private fAuthService: FirebaseAuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private sService: SharedService
  ) { }

  ngOnInit() { }

  submitCryptoForm() {
    this.taptic.selection();
    this.reset();
    this.capitalize();

    this.getMarketQuote(this.cryptoForm.value.convert, this.cryptoForm.value.symbol);
  }

  getMarketQuote(convert: string, symbol: string) {
    this.showLoading();

    this.marketService.getMarketQuote(convert, symbol).then(response => {
      this.result = response;
      this.result.quote = response['quote'][convert];
      this.result.currency = convert;

      this.result.quote.percent_change_1h = this.roundOff(this.result.quote.percent_change_1h);
      this.result.quote.percent_change_24h = this.roundOff(this.result.quote.percent_change_24h);
      this.result.quote.percent_change_7d = this.roundOff(this.result.quote.percent_change_7d);

      this.taptic.notification({
        type: "success"
      });

      this.removeLoading();
    }).catch(error => {
      this.showToast(error.error.message);

      this.removeLoading();
    });
  }

  roundOff(value: number): number {
    return +value.toFixed(2);
  }

  reset() {
    this.result = null;
    this.errorMsg = null;
  }

  private capitalize() {
    this.cryptoForm.value.convert = this.cryptoForm.value.convert.toUpperCase();
    this.cryptoForm.value.symbol = this.cryptoForm.value.symbol.toUpperCase();
  }

  zecToUsd() {
    this.taptic.selection();
    this.reset();
    this.getMarketQuote("USD", "ZEC");
  }

  ethToUsd() {
    this.taptic.selection();
    this.reset();
    this.getMarketQuote("USD", "ETH");
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

  async removeLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  async showUserPopover(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: UserPopoverPage,
      event: ev,
      componentProps: {
        user: this.sService.loggedInUser
      }
    });
    return await popover.present();
  }

  async doLogout() {
    this.taptic.selection();
    await this.fAuthService.doLogout();
    this.router.navigate(['/login']);
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
}
