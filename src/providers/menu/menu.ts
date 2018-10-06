import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FirstRunPage } from '../../pages';

// import { Storage } from '@ionic/storage';

// import { Api } from '../api/api';

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
export class Menu {
    pages: any[] = [
        // { title: 'Tutorial', component: 'TutorialPage' },
        // { title: 'Welcome', component: 'WelcomePage' },
        // { title: 'Tabs', component: 'TabsPage' },
        // { title: 'Ads', component: 'CardsPage' },
        // { title: 'Content', component: 'ContentPage' },
        // { title: 'Login', component: 'LoginPage' },
        // { title: 'Signup', component: 'SignupPage' },
        // { title: 'Master Detail', component: 'ListMasterPage' },
        // { title: 'Menu', component: 'MenuPage' },
        // { title: 'Settings', component: 'SettingsPage' },
        // { title: 'Search', component: 'SearchPage' }
      ];
    rootPage;
    constructor(public storage: Storage) { 
        this.storage.get('_token').then((value) => {
            if (value) {
              this.pages[0] = { title: 'Ads', component: 'ListMasterPage' };
              this.pages[1] = { title: 'Logout', component: 'WelcomePage' };
              this.rootPage = 'ListMasterPage';
            } else {
              this.rootPage = FirstRunPage;
            }
        });
    }

    logout() {
        this.pages = [];
        this.pages[0] = { title: 'Login', component: 'LoginPage' };
        this.pages[1] = { title: 'Signup', component: 'SignupPage' };
    }

    login() {
        this.pages[0] = { title: 'Ads', component: 'ListMasterPage' };
        this.pages[1] = { title: 'Logout', component: 'WelcomePage' };
    }
}
