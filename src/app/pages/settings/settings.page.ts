import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  customOptionsCurrency: any = {
    header: 'Currency',
    subHeader: 'Select a currency!',
    translucent: true
  };
  settingsForm: FormGroup = new FormGroup({
    currency: new FormControl('', Validators.required)
  });

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {

  }

  saveForm() {

    this.userService.updatesUserSettings(this.settingsForm.value).then(res => {

    }, error => {

    });
  }
}