import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase';

import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  backendUrl: string = environment.backendUrl;
  rb_api_endpoints: any = environment.rb_api_endpoints;
  token: string;
  loggedInUser: UserModel;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private sService: SharedService
  ) { }

  doSignup(value: any): Promise<any> {

    try {
      return new Promise<any>((resolve, reject) => {
        this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
          .then(user => {

            user.user.updateProfile({
              displayName: value.name,
              photoURL: ""
            });

            this.loggedInUser = {
              createdOn: new Date(),
              name: value.name,
              modifiedOn: new Date(),
              email: value.email,
              id: user.user.uid
            };

            this.sService.loggedInUser = this.loggedInUser;

            this.addNewUserDetails(this.loggedInUser);

            return resolve();
          }, error => reject(error));
      });
    }
    catch (error) {

    }
  }

  doLogin(value: any): Promise<any> {
    try {
      return new Promise<any>((resolve, reject) => {
        this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
          .then(async res => {

            this.afStore.collection('users').doc(res.user.uid).update({
              'logs.loginHistory': firebase.firestore.FieldValue.arrayUnion(new Date())
            });

            await this.afStore.collection('users').doc(res.user.uid).get().subscribe(res => {
              this.sService.loggedInUser = res.data().metadata as UserModel;
            }, error => {

            });

            return resolve(res);
          }, error => reject(error))
      });
    }
    catch (error) {
      return Promise.reject();
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      return new Promise<boolean>(async (resolve, reject) => {
        await this.afAuth.auth.onAuthStateChanged(function (user) {
          if (user) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        });
      });
    }
    catch (error) {
      return Promise.reject();
    }
  }

  async doLogout(): Promise<void> {
    return await this.afAuth.auth.signOut();
  }

  async getToken(): Promise<string> {

    return new Promise<string>(async (resolve, reject) => {
      await this.afAuth.auth.currentUser.getIdToken(true).then(idToken => {
        return resolve(idToken);
      }).catch(error => {
        return reject(error);
      });
    });
  }

  async addNewUserDetails(user: UserModel) {

    try {
      await this.getToken().then(response => {
        this.token = response;
      });

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token
        })
      };

      return new Promise((resolve, reject) => {

        this.http.post((this.backendUrl + this.rb_api_endpoints.addNewUser),
          { user: user }, httpOptions)
          .subscribe((response) => {

            if (response['status'] === true)
              return resolve(response['data']);
            else if (response['status'] === false)
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