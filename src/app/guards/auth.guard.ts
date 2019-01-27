import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { FirebaseAuthService } from '../services/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private fAuthService: FirebaseAuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let url: string = state.url;

    return this.fAuthService.isLoggedIn().then(response => {
      if (response && response === true) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
    }).catch(error => {
      this.router.navigate(['/login']);
      return false;
    })
  }
}