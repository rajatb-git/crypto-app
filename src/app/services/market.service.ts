import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  backendUrl: string = environment.backendUrl;
  rb_api_endpoints: any = environment.rb_api_endpoints;
  token: string;

  constructor(
    private http: HttpClient,
    private fAuthService: FirebaseAuthService
  ) { }

  async getMarketQuote(convert: string, symbol: string) {

    try {

      await this.fAuthService.getToken().then(response => {
        this.token = response;
      });

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token
        })
      };

      return new Promise((resolve, reject) => {

        this.http.post((this.backendUrl + this.rb_api_endpoints.getQuote),
          { convert: convert, symbol: symbol }, httpOptions)
          .subscribe((response) => {

            if (response['status'] === true)
              return resolve(response['data']);
            else if(response['status'] === false)
              return reject(response['message']);
          }, error => {
            return reject(error);
          });
      })
    }
    catch (error) {
      return Promise.reject(error);
    }
  }
}