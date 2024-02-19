import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AppConfiguration } from './../../app-configuration';
import { EventsdatePopoverPage } from './../eventsdate-popover/eventsdate-popover';
import { EventVenuePopoverPage } from './../event-venue-popover/event-venue-popover';
import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { DataService } from './../services/data-services/data-service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage implements OnInit {
  searchInput: string;
  adminGlobals: any;
  events: any;
  // url = 'assets/imgs/localevel_logoi3.png';
  url = 'assets/imgs/search-defaultimg.png';
  loader = true;
  fullticketsData: any;
  todaysDate: string;
  currentPosition: any;
  pageCount = 2;
  disableInfiniteScroll = false;
  domain: string;
  searchFlag = false;
  keyword: string;
  isLocationPermitted: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private dataService: DataService,
    private dataExchangeService: DataExchangeService,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public plt: Platform,
    public appConfiguration: AppConfiguration,
    private storage: Storage,
    private alertCtrl: AlertController,
    private openNativeSettings: OpenNativeSettings
  ) {
    // this.domain = appConfiguration.domain;
    this.storage.get('selectedDomain').then((val) => {
      if (val) {
        this.domain = val.id;
      }
    })

    // this.plt.resume.subscribe(async () => {
    //   this.loader = true;
    //   this.getEventsBasedOnPosition();
    // });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SearchPage');
  //   let successCallback = (isAvailable) => {
  //     console.log('Is available? ' + isAvailable);
  //     if(isAvailable) {
  //       this.geolocation
  //       .getCurrentPosition()
  //       .then((resp) => {
  //         this.currentPosition = resp;
  //         // resp.coords.latitude
  //         // resp.coords.longitude
  //         const reqObj = {
  //           user_id: this.adminGlobals.user_id,
  //           location: resp.coords.latitude + ', ' + resp.coords.longitude,
  //           keyword: '',
  //           device_id: this.adminGlobals.device_id,
  //           page_id: 1,
  //           per_page_limit: 10
  //         };

  //         this.searchEvents(reqObj);
  //       })
  //       .catch((error) => {
  //         console.log('Error getting location', error);
  //       });
  //     } else {
  //       let alert = this.alertCtrl.create({
  //         title: 'Warning',
  //         message: 'Do you want to open location settings?',
  //         buttons: [
  //           {
  //             text: 'Open Settings',
  //             handler: () => {
  //               console.log('Settings clicked');
  //               this.openNativeSettings.open('location');
  //             }
  //           }
  //         ]
  //       });
  //       alert.present();
  //     }
  //    };
  //   let errorCallback = (e) => console.error(e);

  //   this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);
  // }
  ionViewDidEnter() {
    console.log('did enter')
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
              this.locationPermissionDenied();
            }
          }
        ],
        enableBackdropDismiss: false
      });
      alert.present();
    } else {
      if(this.isLocationPermitted == 'true'){
        this.locationPermissionAccepted();
      } else {
        this.locationPermissionDenied();
      }
    }
  }

  locationPermissionAccepted() {
    this.geolocation
    .getCurrentPosition()
    .then((resp) => {
      this.currentPosition = resp;
      console.log("location details",resp.coords.latitude + ', ' + resp.coords.longitude)
      const reqObj = {
        user_id: this.adminGlobals.user_id,
        location: resp.coords.latitude + ', ' + resp.coords.longitude,
        keyword: '',
        device_id: this.adminGlobals.device_id,
        domain_id: this.domain,
        page_id: 1,
        per_page_limit: 10
      };

      this.searchEvents(reqObj);
    })
    .catch((error) => {
      this.loader = false;
      console.log('Error getting location', error);
    });
  }
  locationPermissionDenied() {
    let alert = this.alertCtrl.create({
      title: 'Permission required',
      subTitle: 'This application requires access to your location.',
      message: 'Please enable your GPS location and grant permission for MyEvents!.',
      buttons: [
        {
          text: 'Open GPS Settings',
          handler: () => {
            this.openNativeSettings.open('location');
          }
        },
        {
          text: 'Location permission',
          handler: () => {
            this.openNativeSettings.open('application_details');
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  ngOnInit() {
    this.adminGlobals = this.dataExchangeService.getAdminGlobals();
  }
  /**** filtering the ticket result list based on user entry ****/
  onSearchBarInput(ev: any) {
    // Reset items back to all of the items
    // this.events = this.fullticketsData;
    // set val to the value of the searchbar
    if (ev) {
      const val = ev.target.value;
      this.keyword = val;
      this.searchFlag = true;
    } else {
      this.keyword = '';
      this.searchFlag = false;
    }

    // if the value is an empty string don't filter the items
    // if (val && val.trim() != '') {
    // 	this.events = this.events.filter((item) => {
    // 		return item.event_name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    // 	});
    // }

    const reqObj = {
      user_id: this.adminGlobals.user_id,
      // location: '',
      // keyword: val,
      location: this.keyword != '' ? '' : this.currentPosition.coords.latitude + ', ' + this.currentPosition.coords.longitude,
      keyword: this.searchFlag == true ? this.keyword : '',
      device_id: this.adminGlobals.device_id,
      domain_id: this.domain,
      page_id: 1,
      per_page_limit: 10
    };
    this.loader = true;
    this.searchEvents(reqObj);
  }

  /**** cancel click in searchbar showing full data ****/
  onSearchBarCancel() {
    this.searchFlag = false;
    this.events = this.fullticketsData;
  }

  onSearchInput(ev: any) {
    const val = ev.target.value;
    if (!val) {
      this.searchFlag = false;
      this.onSearchBarInput('');
    }
  }

  searchEvents(reqObj) {
    this.dataService.searchEvents(reqObj).subscribe(
      (response: any) => {
        this.loader = false;
        // this.events = response.body.data;
        this.fullticketsData = response.body.data;
        this.events = this.setEventDateTime(response);
      },
      (error) => {
        this.loader = false;
        console.log('test' + error);
      }
    );
  }

  /**** show popover on click of venue to display venue address and location icon*****/
  showVenuePopOver(myEvent, eventData) {
    let popover = this.popoverCtrl.create(EventVenuePopoverPage, { data: eventData });
    popover.present({
      ev: myEvent
    });
  }

  /**** show popover on click of date to display future events dates*****/
  showDatePopOver(myEvent, eventData) {
    let popover = this.popoverCtrl.create(EventsdatePopoverPage, { data: eventData });
    popover.present({
      ev: myEvent
    });
  }

  onViewDetail(e) {
    let loading = this.loadingCtrl.create({
      content: 'Redirecting to Event Details...'
    });
    loading.present();
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      event_id: e.event_id,
      device_id: this.adminGlobals.device_id,
      domain_id: this.domain
    };
    console.log(reqObj);
    this.dataService.eventDetails(reqObj).subscribe(
      (response: any) => {
        console.log(response);
        loading.dismiss();
        if (response.status == 200 && response.statusText === 'OK' && response.body.status === 'success') {
          // if(this.plt.is('android')){
          //   window.open(response.body.data);
          // }else{
          // const options: InAppBrowserOptions = {
          //   closebuttoncolor: 'white',
          //   toolbarcolor: '#eba821',
          //   navigationbuttoncolor: 'white',
          //   footer: 'yes',
          //   footercolor: '#eba821',
          //   clearcache: 'yes',
          //   clearsessioncache: 'yes'
          // }
          // let target = "_blank";
          // this.iab.create(response.body.data, target, options);
          // }
          this.dataExchangeService.openUrl(response.body.data);
        }
      },
      (error) => {
        loading.dismiss();
        console.log('test' + error);
      }
    );

  }

  doRefresh(refresher) {
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      location: this.searchFlag == true ? '' : this.currentPosition.coords.latitude + ', ' + this.currentPosition.coords.longitude,
      keyword: this.searchFlag == true ? this.keyword : '',
      device_id: this.adminGlobals.device_id,
      domain_id: this.domain,
      page_id: 1,
      per_page_limit: 10
    };

    this.dataService.searchEvents(reqObj).subscribe(
      (response: any) => {
        this.loader = false;
        // this.events = response.body.data;
        this.fullticketsData = response.body.data;
        this.events = this.setEventDateTime(response);
        refresher.complete();
      },
      (error) => {
        this.loader = false;
        console.log('test' + error);
        refresher.complete();
      }
    );
  }

  setEventDateTime(response) {
    const eventsData = response.body.data;
    eventsData.forEach((data) => {
      let flag = true;
      if (data.event_date_time != null) {
        data.event_date_time.forEach((dataItem) => {
          const eventdate = dataItem.event_date;
          const eventtime = data.event_date_time[0].event_timings[0].start_time;
          const today = new Date();
          const year = today.getFullYear();
          const month = ('0' + (today.getMonth() + 1)).slice(-2);
          const day = ('0' + today.getDate()).slice(-2);
          const todayDate = year + '-' + month + '-' + day;
          this.todaysDate = todayDate;
          if (eventdate >= todayDate && flag) {
            data.eventdate = eventdate;
            data.eventtime = eventtime;
            flag = false;
          }
        });
      } else {
        data.eventdate = 'Not available';
      }
    });
    const filterData = eventsData.filter((event) => {
      return event.eventdate >= this.todaysDate;
    });

    return filterData;
  }

  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      const reqObj = {
        user_id: this.adminGlobals.user_id,
        location: this.searchFlag == true ? '' : this.currentPosition.coords.latitude + ', ' + this.currentPosition.coords.longitude,
        keyword: this.searchFlag == true ? this.keyword : '',
        device_id: this.adminGlobals.device_id,
        domain_id: this.domain,
        page_id: this.pageCount,
        per_page_limit: 10
      };
      this.dataService.searchEvents(reqObj).subscribe(
        (response: any) => {
          this.pageCount = this.pageCount + 1;
          const events = this.setEventDateTime(response);
          this.events = this.events.concat(events);
          this.fullticketsData = this.fullticketsData.concat(events);
          const totalRecords = response.body.total_records;
          this.infiniteScrollEnble(this.events.length, totalRecords);
          resolve();
        },
        (error) => {
          console.log('test' + error);
          resolve();
        }
      );
    });
  }

  infiniteScrollEnble(length, totalRecords) {
    if (length == totalRecords) {
      this.disableInfiniteScroll = false;
    } else {
      this.disableInfiniteScroll = true;
    }
  }
}
