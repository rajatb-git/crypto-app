import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { SharedService } from './shared.service';
import { SettingsModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private sService: SharedService,
    private afStore: AngularFirestore
  ) { }

  updatesUserSettings(settings: SettingsModel) {

    return new Promise((resolve, reject) => {

      this.afStore.collection('users').doc(this.sService.loggedInUser.value.id).update({
        'metadata.settings': settings
      }).then(res => { 
        debugger;
      }, error => { 
        debugger;
      });
    });
  }
}