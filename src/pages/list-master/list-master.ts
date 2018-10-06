import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';


import { Item } from '../../models/item';
import { Items, Room } from '../../providers';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: any = [];
  isDataAvailable: boolean = false;
  constructor(public navCtrl: NavController,
    public items: Items, public modalCtrl: ModalController,
    public storage: Storage, public loadingCtrl: LoadingController,
    private nativeAudio: NativeAudio,
    public roomService: Room) {
      this.nativeAudio.preloadSimple('dhol', '../../assets/sounds/dhol.wav');
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  hitDhol() {
    this.nativeAudio.play('dhol');
    this.roomService.hit(1);
  }

  ngOnInit() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...'
    });
    loading.present();
    this.items.query({offset: 0}).subscribe((resp) => {
      loading.dismiss();
      this.isDataAvailable = true;
      this.currentItems = resp; 
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }
  
  ionViewCanEnter(): any {
    // here we can either return true or false
    // depending on if we want to leave this view
    return new Promise((resolve, reject) => {
      return this.storage.get('_token').then((value) => {
        if (value) {
          return resolve();
        } else {
          return reject();
        }
      });
    });
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        // this.items.add(item);
        this.ngOnInit();
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  doInfinite(infiniteScroll) {
    this.items.query({offset: this.currentItems.length}).subscribe((resp) => {
      this.isDataAvailable = true;
      this.currentItems = this.currentItems.concat(resp); 
      infiniteScroll.complete();
    }, (err) => {
      console.log(err);
      infiniteScroll.complete();
    });
  }
}
