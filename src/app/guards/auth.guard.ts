import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { FirebaseAuthService } from '../services/firebase-auth.service';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private fAuthService: FirebaseAuthService,
    private router: Router,
    private sService: SharedService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let url: string = state.url;

    // return true;

    return this.fAuthService.isLoggedIn().then(response => {
      if (response && response === true) {

        if(!this.sService.loggedInUser.value.id) {
          this.fAuthService.getUserDetails();
        }

        return true;
      }

      this.router.navigate(['/login']);
      return false;
    }).catch(error => {
      this.router.navigate(['/login']);
      return false;
    });
  }
}