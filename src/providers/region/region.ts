import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

@Injectable()
export class Region {

  constructor(public api: Api) { }

  getRegionDate() {
    let seq = this.api.get('getregion').share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

}
