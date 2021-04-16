import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';
import { Router } from '@angular/router';

import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { MarketService } from 'src/app/services/market.service';
import { CryptoCompareResponseI, CryptoCompareNewsResponseI } from 'src/app/models/shared.model';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.page.html',
  styleUrls: ['./news-list.page.scss'],
})
export class NewsListPage implements OnInit {

  loading: any;
  listingData: any;
  sortOrder: string = 'latest';
  category: string = 'all';
  categories: Array<string> = ["BTC","ETH","DOGE","LTC","XMR","ZEC","ETC","XRP","TRX","ADA","DASH","XTZ","USDT","Mining","Exchange","Market","Asia","ICO","Regulation","Blockchain","Trading","Technology","Wallet","Altcoin","Fiat","Business","Commodity","Sponsored"];

  customOptionsSort: any = {
    header: 'Sort By',
    subHeader: 'Pick a sort order!',
    translucent: true
  };

  customOptionsCategory: any = {
    header: 'Categories',
    subHeader: 'Select a category!',
    translucent: true
  };

  constructor(
    private loadingCtrl: LoadingController,
    private marketService: MarketService,
    private taptic: TapticEngine,
    private fAuthService: FirebaseAuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.showLoading();

    this.marketService.getNews(this.sortOrder, this.category).then(res => {
      this.listingData = res as Array<CryptoCompareNewsResponseI>;

      this.taptic.notification({
        type: "success"
      });

      this.removeLoading();
    }, error => {
      this.showToast("Error occured! Please try again!");
      this.removeLoading();
    });
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

  goToSource(url) {
    window.open(url, '_blank');
  }

  async removeLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
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
