import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera,
    public items: Items, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.form = formBuilder.group({
      image: [''],
      title: ['', Validators.required],
      description: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  createItem() {
    console.log('//////////////////////////');
    
    console.log(this.form);
    
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'image': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'image': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['image'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Creating Ad Please Wait...'
    });
    loading.present();
    this.items.createAd(this.form.value).subscribe((resp) => {
      // this.navCtrl.push(MainPage);
      console.log(resp);
      if (!this.form.valid) { return; }
      loading.dismiss();
      this.viewCtrl.dismiss(this.form.value);
    }, (err) => {
      console.log(err);
      let alert = this.alertCtrl.create({
        title: 'Not Allowed',
        subTitle: err.error,
        buttons: [{
          text: 'OK',
          handler: () => {
            loading.dismiss();
            this.viewCtrl.dismiss(this.form.value);
          }
        }]
      });
      alert.present();
    });
  }
}
