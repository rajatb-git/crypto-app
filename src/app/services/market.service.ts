import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { ResponseI } from '../models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  backendUrl: string = environment.backendUrl;
  rb_api_endpoints: any = environment.rb_api_endpoints;
  token: string = "";

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

        this.http.post((this.backendUrl + this.rb_api_endpoints.getCustomQuote),
          { convert: convert, symbol: symbol }, httpOptions)
          .subscribe((response: ResponseI) => {

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

  async getTopMarketCap(limit: number, currency: string): Promise<any> {

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

        this.http.post((this.backendUrl + this.rb_api_endpoints.getTopMarketCap),
          { limit: limit, currency: currency }, httpOptions)
          .subscribe((response: ResponseI) => {

            if (response['status'] === true)
              return resolve(response['data']);
            else if(response['status'] === false)
              return reject(response['message']);
          }, error => {
            return reject(error);
          });
      });
    }
    catch (error) {
      return Promise.reject(error);
    }
  }
}