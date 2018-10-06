import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '..';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };
  confirmPassword: String; 

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  forgotPassword() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...'
    });
    loading.present();
    this.user.forgotPassword(this.account).subscribe((resp) => {
      // this.navCtrl.push(MainPage);
      this.navCtrl.pop();
      let alert = this.alertCtrl.create({
        title: 'Please verify your Email',
        subTitle: 'Please click on the link that we have sent you in Email to change your password.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.navCtrl.setRoot('LoginPage');
            loading.dismiss();
          }
        }]
      });
      loading.dismiss();
      alert.present();
    }, (err) => {
      loading.dismiss();
      // this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: err && err.error ? err.error.toUpperCase() : 'Somthing went wrong please try again',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
