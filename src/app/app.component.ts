import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { Settings } from '../providers';
import { Menu } from '../providers';

@Component({
  template: `
  <ion-split-pane when="sm">
  <ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <button ion-button menuToggle left>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="menu-container">
      <ion-list no-lines>
        <button menuClose ion-item *ngFor="let p of menu.pages" (click)="openPage(p)" class="transparent list-item">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav [root]="menu.rootPage" #content main swipeBackEnabled="false"></ion-nav>
  </ion-split-pane>
  `
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // pages: any[] = []

  constructor(public menu: Menu, private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component).then((val) => {
      if (!val) {
        this.nav.setRoot('WelcomePage');
      }
    });
  }
}
