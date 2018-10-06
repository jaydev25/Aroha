import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { User, Region } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { firstName: string, lastName: string, email: string, password: string, contact: string, accType: string, city: string, state: string, country: any, birthDate: Date, occupation: string } = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contact: '',
    accType: '',
    city: '',
    state: '',
    country: '',
    birthDate: null,
    occupation: ''
  };

  accType: string = 'Member';
  confirmPassword: String; 

  countries: any[];
  states: any[];
  cities: any[];
  filteredStates: any[];
  filteredCities: any[];

  country: string;
  state: string;
  city: string;
  options : InAppBrowserOptions = {
    location: 'no',
    clearcache: 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls 
    hardwareback: 'no',
    hideurlbar: 'yes'
  };
  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public region: Region,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private theInAppBrowser: InAppBrowser,
    private platform: Platform) {
    
    this.region.getRegionDate().subscribe((resp) => {
      this.countries = resp['countries'];
      this.states = resp['states'];
      this.cities = resp['cities'];
    }, (err) => {
      console.log(err);
    });
    

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  getStatesById(country) {
    this.filteredStates = this.states.filter((state) => {
      return state.country_id == country.id; 
    });
  }

  getCitiesById(state) {
    this.filteredCities = this.cities.filter((city) => {
      return city.state_id == state.id; 
    });
  }

  doSignup() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...',
      duration: 15000
    });
    loading.present();
    // Attempt to login in through our User service
    this.account.country = this.country['name'];
    this.account.state = this.state['name'];
    this.account.city = this.city['name'];
    // this.account.accType = this.accType;
    this.user.signup(this.account).subscribe((resp) => {
      if (resp['url']) {
        // this.navCtrl.push(MainPage);
        let alert = this.alertCtrl.create({
          title: 'Please verify your Email',
          subTitle: 'Please Complete the payment and then click on the link that we have sent you in Email to complete the registration as pathak.',
          buttons: [{
            text: 'OK',
            handler: () => {
              loading.dismiss();
              if (this.platform.is('mobileweb')) {
                this.openWithInAppBrowser(resp['url']);
              } else {
                this.openWithCordovaBrowser(resp['url']);
              }
              // this.navCtrl.setRoot('LoginPage');
            }
          }]
        });
        alert.present();
      } else {
        // this.navCtrl.push(MainPage);
        let alert = this.alertCtrl.create({
          title: 'Please verify your Email',
          subTitle: 'Please click on the link that we have sent you in Email to complete the registration as member.',
          buttons: [{
            text: 'OK',
            handler: () => {
              loading.dismiss();
              this.navCtrl.setRoot('LoginPage');
            }
          }]
        });
        alert.present();
      }
      
      
    }, (err) => {
      // this.navCtrl.push(MainPage);
      // this.navCtrl.setRoot(MainPage);
      loading.dismiss();
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: err && err.error ? err.error.toUpperCase() : 'Somthing went wrong please try again',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentLoadingText() {}

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
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
