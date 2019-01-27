import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  emptyUser: UserModel = {
    createdOn: null,
    email: null,
    id: null,
    modifiedOn: null,
    name: null
  };

  // loggedInUser: UserModel;
  public loggedInUser: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(this.emptyUser);
  constructor() { }
}
