import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase';

import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';
import { SharedService } from './shared.service';
import { ResponseI } from '../models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  backendUrl: string = environment.backendUrl;
  rb_api_endpoints: any = environment.rb_api_endpoints;
  token: string = "";
  loggedInUser: UserModel = new UserModel();

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

            if (user)
              if (user.user) {
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

                this.sService.loggedInUser.next(this.loggedInUser);

                this.addNewUserDetails(this.loggedInUser);

                return resolve();
              }

            return reject();

          }, error => reject(error));
      });
    }
    catch (error) {

    }
  }

  doLogin(value: any): Promise<any> {
    debugger;
    try {
      return new Promise<any>((resolve, reject) => {
        this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
          .then(async res => {

            if (res && res.user) {
              this.afStore.collection('users').doc(res.user.uid).update({
                'logs.loginHistory': firebase.firestore.FieldValue.arrayUnion(new Date())
              });

              await this.afStore.collection('users').doc(res.user.uid).get().subscribe(response => {
                if (response) {
                  this.loggedInUser = response.data().metadata as UserModel;
                  this.sService.loggedInUser.next(response.data().metadata as UserModel);
                }
              }, error => {

              });

              return resolve(res);
            }

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
        await this.afAuth.auth.onAuthStateChanged((user) => {
          if (user) {
            this.loggedInUser.id = user.uid;
            if (!this.loggedInUser.name) {
              this.getUserDetails();
            }
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
    this.sService.logoutUser();
    return await this.afAuth.auth.signOut();
  }

  async getUserDetails() {

    if(!this.loggedInUser || !this.loggedInUser.id) return;
    
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('users').doc(this.loggedInUser.id).get().subscribe(res => {
        if (res) {
          this.loggedInUser = res.data().metadata as UserModel;
          this.sService.loggedInUser.next(res.data().metadata as UserModel);

          return resolve(res.data().metadata);
        }
      });
    });
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
          .subscribe((response: ResponseI) => {

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