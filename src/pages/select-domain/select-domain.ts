import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { Device } from '@ionic-native/device';
import { DataService } from './../services/data-services/data-service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the SelectDomainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-domain',
  templateUrl: 'select-domain.html',
})
export class SelectDomainPage implements OnInit {
  loader: boolean;
  domainList: any;
  selectedDomainIndex = -1;
  isLocationPermitted: string;
  currentPosition: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataService: DataService,
    private device: Device,
    private dataExchangeService: DataExchangeService,
    private storage: Storage,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    ) {
  }

  ngOnInit() {
    this.loader = true;
    const reqObj = {
      "device_id": this.device.uuid == null ? 'qwertyuiop13349s' : this.device.uuid
    }

    this.dataService.getDomainList(reqObj).subscribe(
      (response: any) => {
        this.loader = false;
        this.domainList = response.body.data;
      });
      this.getEventsBasedOnPosition();
  }

  getEventsBasedOnPosition() {
    this.isLocationPermitted = localStorage.getItem('isLocationPermitted');
    if(this.isLocationPermitted === null || this.isLocationPermitted === ''){
      let alert = this.alertCtrl.create({
        title: 'Location Permission',
        subTitle: '<b>Allow MyEvents! to access your location when using the App.</b> <BR/> <BR/> For improved ability to display events happening near your location while searching in the event search screen, the MyEvents! App checks your current location and displays nearby events at the top of the events list. The location information is neither stored nor shared with any other services. We do not access the location in the background or when the app is closed.',
        message: '',
        buttons: [
          {
            text: 'Allow',
            handler: () => {
              localStorage.setItem('isLocationPermitted', 'true');
             this.locationPermissionAccepted();
            }
          },
          {
            text: 'Deny',
            handler: () => {
              localStorage.setItem('isLocationPermitted', 'false');
              alert.dismiss()
            }
          }
        ],
        enableBackdropDismiss: false
      });
      alert.present();
    } else if(this.isLocationPermitted == 'true'){
        this.locationPermissionAccepted();
      }
  }


  locationPermissionAccepted() {
    this.geolocation
    .getCurrentPosition()
    .then((resp) => {
      this.currentPosition = resp;
      console.log("location on login", resp);
    })
    .catch((error) => {
      console.log('Error getting location', error);
    });
  }

  selectedDomain(domainData, i) {
    this.selectedDomainIndex = i;
  }

  onContine() {
    console.log(this.domainList[this.selectedDomainIndex]);
    const domain = this.domainList[this.selectedDomainIndex]
    this.storage.set('selectedDomain',domain);
    this.storage.set('isDomainSelected',true);
    this.dataExchangeService.rootPageName.next('LoginPage');
  }

}
