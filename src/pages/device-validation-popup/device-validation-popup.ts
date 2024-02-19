import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DeviceValidationPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-device-validation-popup',
  templateUrl: 'device-validation-popup.html',
})
export class DeviceValidationPopupPage {
  status: boolean;
  constructor(private navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceValidationPopupPage');
  }

  ionViewWillEnter(){
    this.status = this.navParams.get('data');
  }

  closemodal(ev, data) {
    if(ev.direction == 8 || data == true){
      this.view.dismiss();
    }
  }
}
