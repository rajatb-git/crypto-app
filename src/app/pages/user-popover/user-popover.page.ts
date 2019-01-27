import { NavParams, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';

import { FirebaseAuthService } from '../../services/firebase-auth.service';

import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.page.html',
  styleUrls: ['./user-popover.page.scss'],
})
export class UserPopoverPage implements OnInit {

  user: UserModel;

  constructor(
    private popoverCtrl: PopoverController,
    private navParams: NavParams,
    private taptic: TapticEngine,
    private fAuthService: FirebaseAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.navParams.get('user');
  }

  async doLogout() {
    this.popoverCtrl.dismiss();
    this.taptic.selection();
    await this.fAuthService.doLogout();
    this.router.navigate(['/login']);
  }

  closePopover() {
    this.popoverCtrl.dismiss();
  }

}