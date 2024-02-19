import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ManualscanValidationPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manualscan-validation-popup',
  templateUrl: 'manualscan-validation-popup.html',
})
export class ManualscanValidationPopupPage {
  status: boolean;
  message = '';
  apiResponse: any;
  timeStamp: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManualscanValidationPopupPage');
  }

  ionViewWillEnter(){
    this.status = this.navParams.get('data');
    this.apiResponse = this.navParams.get('responseData');
    this.message = this.apiResponse.message;
    this.timeStamp = this.apiResponse.data == null ? [] : this.apiResponse.data;
  }


  closemodal(ev, data) {
    const dataValue = 'dismissed'
    if(ev.direction == 8 || data == true){
      this.view.dismiss(dataValue);
    }
  }
}
