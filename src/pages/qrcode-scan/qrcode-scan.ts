import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the QrcodeScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-qrcode-scan',
	templateUrl: 'qrcode-scan.html'
})
export class QrcodeScanPage implements OnInit {
  stausData: any;
  scannerData: any;
  textStatus: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    //  private qrScanner: QRScanner,
     public toastCtrl: ToastController) {}

	ngOnInit() {
	}
//   ionViewDidEnter(){
//     this.qrScanner.prepare()
//    .then((status: QRScannerStatus) => {
//      if (status.authorized) {
//        // camera permission was granted
//        var camtoast = this.toastCtrl.create({
//          message: 'camera permission granted',
//          duration: 1000
//        });
//        camtoast.present();
//        // start scanning
//        this.qrScanner.show()
//        window.document.querySelector('ion-app').classList.add('cameraView');
//        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
//          console.log('Scanned something', text);
//          window.document.querySelector('ion-app').classList.remove('cameraView');
//          this.qrScanner.hide(); // hide camera preview
//          const toast = this.toastCtrl.create({
//            message: 'Your scanned text is this :'+text,
//            duration: 6000
//          });
//          toast.present();
//          scanSub.unsubscribe(); // stop scanning
//        });
//      } else if (status.denied) {
//        const toast = this.toastCtrl.create({
//          message: 'camera permission was denied',
//          duration: 3000
//        });
//        toast.present();
//        // camera permission was permanently denied
//        // you must use QRScanner.openSettings() method to guide the user to the settings page
//        // then they can grant the permission from there
//      } else {
//        const toast = this.toastCtrl.create({
//          message: 'You can ask for permission again at a later time.',
//          duration: 3000
//        });
//        toast.present();
//        // permission was denied, but not permanently. You can ask for permission again at a later time.
//      }
//    })
//    .catch((e: any) => console.log('Error is', e));

// }
	ionViewDidLoad() {
		console.log('ionViewDidLoad QrcodeScanPage');
  }

  ionViewWillLeave(){
    window.document.querySelector('ion-app').classList.remove('cameraView');
  }

}
