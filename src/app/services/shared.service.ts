import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  emptyUser: UserModel = new UserModel();

  // loggedInUser: UserModel;
  public loggedInUser: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(this.emptyUser);
  constructor() { }

  logoutUser() {
    this.loggedInUser = new BehaviorSubject<UserModel>(this.emptyUser);
  }
}
