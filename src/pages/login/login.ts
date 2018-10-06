import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  options : InAppBrowserOptions = {
    location: 'no',
    clearcache: 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls 
    hardwareback: 'no',
    hideurlbar: 'yes'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private theInAppBrowser: InAppBrowser,
    private platform: Platform) {
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...'
    });
    loading.present();
    this.user.login(this.account).subscribe((resp) => {
      // this.navCtrl.push(MainPage);
      if (resp['url']) {
        loading.dismiss();
        if (this.platform.is('mobileweb')) {
          this.openWithInAppBrowser(resp['url']);
        } else {
          this.openWithCordovaBrowser(resp['url']);
        }
      } else {
        setTimeout(() => {
          loading.dismiss();
          this.navCtrl.setRoot(MainPage);
        }, 1000);
      }
    }, (err) => {
      loading.dismiss();
      // this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: err && err.error ? err.error.toString().toUpperCase() : 'Somthing went wrong please try again',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

  public openWithSystemBrowser(url : string){
    let target = "_system";
    const browser = this.theInAppBrowser.create(url,target,this.options);
  }

  public openWithInAppBrowser(url : string){
    let target = "_blank";
    const browser = this.theInAppBrowser.create(url,target,this.options);
  }

  public openWithCordovaBrowser(url : string){
    let target = "_self";
    const browser = this.theInAppBrowser.create(url,target,this.options);
    browser.on('exit').subscribe(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }  
}
