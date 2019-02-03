import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';

import { MarketService } from 'src/app/services/market.service';
import { CryptoCompareResponseI } from 'src/app/models/shared.model';

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
    header: 'Colors',
    subHeader: 'Select your favorite color'
  };

  constructor(
    private loadingCtrl: LoadingController,
    private marketService: MarketService,
    private taptic: TapticEngine,
  ) { }

  ngOnInit() {
    this.showLoading();

    this.marketService.getTopMarketCap(this.limit, this.currency).then(res => {

      this.listingData = res as Array<CryptoCompareResponseI>;

      this.taptic.notification({
        type: "success"
      });

      this.removeLoading();
    }, error => {
      debugger;
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
}