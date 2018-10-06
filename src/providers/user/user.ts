import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Api } from '../api/api';
import { Menu } from '../menu/menu';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _token: any;

  constructor(public api: Api, public storage: Storage, public menu: Menu) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success) {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success) {
        this.storage.set('_email', res.email);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  forgotPassword(data: any) {
    let seq = this.api.post('changepasswordemail', data).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success) {
       
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._token = null;
    this.menu.logout();
    this.storage.remove('_token').then(() => {
      this.api.setAPIHeaders();
    });
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    console.log(resp);
    this.menu.login();
    this._token = resp.token;
    return this.storage.set('_token', resp.token).then(() => {
      this.api.setAPIHeaders();
    });  
  }
}
