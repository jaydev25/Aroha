import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  // url: string = 'https://aroha-api.herokuapp.com';
  url: string = 'http://localhost:5000';
  token: string;
  constructor(public http: HttpClient, public storage: Storage) {
    this.setAPIHeaders();
  }

  setAPIHeaders() {
    this.storage.get('_token').then((value) => {
      if (value) {
        this.token = value;
      } else {
        this.token = '';
      }
      console.log(this.token);
    });
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.token
      })
    };
    reqOpts.headers = httpOptions.headers;
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.token
      })
    };
    console.log('post');
    return this.http.post(this.url + '/' + endpoint, body, httpOptions);
  }

  put(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.token
      })
    };
    return this.http.put(this.url + '/' + endpoint, body, httpOptions);
  }

  delete(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.token
      })
    };
    return this.http.delete(this.url + '/' + endpoint, httpOptions);
  }

  patch(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.token
      })
    };
    return this.http.patch(this.url + '/' + endpoint, body, httpOptions);
  }
}
