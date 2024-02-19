import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

import { TicketscanPopoverPage } from './../ticketscan-popover/ticketscan-popover';
/**
 * Generated class for the TicketscanValidationPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ticketscan-validation-popup',
  templateUrl: 'ticketscan-validation-popup.html',
})
export class TicketscanValidationPopupPage {
  status: boolean;
  apiResponse: any;
  message = '';
  timeStamps = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
    public popoverCtrl: PopoverController,
    private nativeAudio: NativeAudio
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketscanValidationPopupPage');
  }

  ionViewWillEnter(){
    this.status = this.navParams.get('data');
    this.apiResponse = this.navParams.get('responseData');
    this.message = this.apiResponse.message;
    this.timeStamps = this.apiResponse.data == null ? [] : this.apiResponse.data;
    this.nativeAudio.preloadSimple('uniqueId1', 'assets/audio/Barcode-scanner-beep-sound.mp3').then();
     if(this.status && this.timeStamps[0]== 1)
     {
      setTimeout(() => {
        this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
        this.view.dismiss();
      }, 1000);
      

     }
  }

  closemodal(ev, data) {
    const dataValue = 'dismissed'
    if(ev.direction == 8 || data == true){
      this.view.dismiss(dataValue);
    }
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TicketscanPopoverPage,{data:this.timeStamps});
    popover.present({
      ev: myEvent,
    });
    
  }

}
