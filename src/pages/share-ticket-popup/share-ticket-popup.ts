import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ShareTicketPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share-ticket-popup',
  templateUrl: 'share-ticket-popup.html',
})
export class ShareTicketPopupPage {
  status: boolean;
  apiResponse: any;
  message = '';
  emailId: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareTicketPopupPage');
  }

  ionViewWillEnter(){
    this.status = this.navParams.get('data');
    this.apiResponse = this.navParams.get('responseData');
    this.message = this.apiResponse.message;
    this.emailId = this.navParams.get('emailId');
  }

  closemodal(ev, data) {
    const dataValue = this.status;
    if(ev.direction == 8 || data == true){
      this.view.dismiss(dataValue);
    }
  }

}
