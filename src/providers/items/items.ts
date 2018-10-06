import { Injectable } from '@angular/core';

import { Item } from '../../models/item';
import { Api } from '../api/api';

@Injectable()
export class Items {
  AWS_S3_BASE_URL: string = 'https://s3-ap-southeast-1.amazonaws.com/adsserverbucket/';
  constructor(public api: Api) { }

  query(params?: any) {
    let seq = this.api.get('api/ads/listing', params);
    console.log('api call');
    
    // seq.subscribe((res: any) => {
    //   // If the API returned a successful response, mark the user as logged in
    //   console.log(res);
    // }, err => {
    //   console.error('ERROR', err);
    // });

    return seq;
  }

  createAd(params?: any) {
    let seq = this.api.post('api/ads/create', params);
    console.log('api call');
    
    // seq.subscribe((res: any) => {
    //   // If the API returned a successful response, mark the user as logged in
    //   console.log(res);
    // }, err => {
    //   console.error('ERROR', err);
    // });

    return seq;
  }

  add(item: Item) {
  }

  delete(item: Item) {
  }

}
