import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the TicketValidationPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ticket-validation-popup',
  templateUrl: 'ticket-validation-popup.html',
})
export class TicketValidationPopupPage {

  status: boolean;
  message: string;
  constructor(private navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceValidationPopupPage');
  }

  ionViewWillEnter(){
    this.status = this.navParams.get('data');
    this.message = this.navParams.get('message');
  }

  closemodal(ev, data) {
    if(ev.direction == 8 || data == true){
      this.view.dismiss();
    }
  }

}
