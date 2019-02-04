import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';

import { MarketService } from 'src/app/services/market.service';
import { CryptoCompareResponseI } from 'src/app/models/shared.model';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  loading: any;
  listingData: any;
  limit: number = 10;
  currency: string = 'USD';

  customActionSheetOptions: any = {
    header: 'Limit',
    subHeader: 'Number of items!'
  };

  constructor(
    private loadingCtrl: LoadingController,
    private marketService: MarketService,
    private taptic: TapticEngine,
    private fAuthService: FirebaseAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.showLoading();

    this.marketService.getTopMarketCap(this.limit, this.currency).then(res => {
      this.listingData = res as Array<CryptoCompareResponseI>;

      this.taptic.notification({
        type: "success"
      });

      this.removeLoading();
    }, error => {
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
}