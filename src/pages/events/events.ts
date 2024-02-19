import { EventVenuePopoverPage } from './../event-venue-popover/event-venue-popover';
import { EventsdatePopoverPage } from './../eventsdate-popover/eventsdate-popover';
import { SearchTicketPage } from './../search-ticket/search-ticket';
import { TicketscanValidationPopupPage } from './../ticketscan-validation-popup/ticketscan-validation-popup';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  LoadingController,
  ModalController,
  Platform,
  AlertController,
  PopoverController
} from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ToastController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
// import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';

import { DataService } from './../services/data-services/data-service';
import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { DeviceValidationPopupPage } from './../device-validation-popup/device-validation-popup';
import { QrcodeScanPage } from './../qrcode-scan/qrcode-scan';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage implements OnInit {
  Events: string;
  events: any;
  loader = false;
  allevents: any;
  todayEventsData: any;
  upcomingEventsData: any;
  pastEventsData: any;
  disableFlag = true;
  reqObject: {};
  pageNum = {
    today: 1,
    past: 1,
    upcoming: 1
  };
  selectedTab: string;
  spinnerFlag = false;
  id: number;
  scanUrl: any;
  noDataFoundMsg: string;
  pushPage = QrcodeScanPage;
  cameraCloseFlag = false;
  adminGlobals: any;
  pageCount: number;
  disableInfiniteScroll = false;
  totalRecords: number;
  todaysDate: string;
  @ViewChild(Content) content: Content;
  // url = 'assets/imgs/localevel_logoi3.png';
  url = 'assets/imgs/event-defaultimg.png';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataService: DataService,
    private dataExchangeService: DataExchangeService,
    public loadingCtrl: LoadingController,
    private modal: ModalController,
    private qrScanner: QRScanner,
    public toastCtrl: ToastController,
    platform: Platform,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public plt: Platform,
    private launchNavigator: LaunchNavigator // private cameraPreview: CameraPreview
  ) {
    this.Events = 'TODAY';

    platform.registerBackButtonAction(() => {
      if (this.cameraCloseFlag) {
        this.closeCameraPreview();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

  ngOnInit() {
    this.adminGlobals = this.dataExchangeService.getAdminGlobals();
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      device_id: this.adminGlobals.device_id,
      event_type: 'today',
      page_id: 1,
      per_page_limit: 10
    };
    // this.reqObject = reqObj;
    this.loader = true;
    this.selectedTab = 'today';
    this.getEventData(reqObj);
  }

  /********** sort event data **************/
  sortEventData(data: any) {
    return data.sort((a, b) => {
      return <any>new Date(b.eventdate) - <any>new Date(a.eventdate);
    });
  }

  /**** show popover on click of date to display future events dates*****/
  showDatePopOver(myEvent, eventData) {
    let popover = this.popoverCtrl.create(EventsdatePopoverPage, { data: eventData });
    popover.present({
      ev: myEvent
    });
  }

  /**** show popover on click of venue to display venue address and location icon*****/
  showVenuePopOver(myEvent, eventData) {
    let popover = this.popoverCtrl.create(EventVenuePopoverPage, { data: eventData });
    popover.present({
      ev: myEvent
    });
  }
  /********* filtering data based on tab selection ******/
  onEventData(selectedTab) {
    this.selectedTab = selectedTab;
    this.content.scrollToTop();
    this.loader = true;
    this.pageCount = 1;
    this.pageNum = {
      today: 1,
      past: 1,
      upcoming: 1
    };
    if (selectedTab == 'today') {
      // this.updateSegmentValues(this.allevents, selectedTab);
      this.disableInfiniteScroll = false;
      this.noDataFoundMsg = 'No Events Today';
    } else if (selectedTab == 'upcoming') {
      // this.updateSegmentValues(this.allevents, selectedTab);
      this.disableInfiniteScroll = false;
      this.noDataFoundMsg = 'No Upcoming Events';
    } else {
      // this.updateSegmentValues(this.allevents, selectedTab);
      this.disableInfiniteScroll = false;
      this.noDataFoundMsg = 'No Events Found';
    }

    const reqObj = {
      user_id: this.adminGlobals.user_id,
      device_id: this.adminGlobals.device_id,
      event_type: selectedTab,
      page_id: this.pageCount,
      per_page_limit: 10
    };
    this.getEventData(reqObj);
  }

  /********* get event data ******/
  getEventData(reqObj) {
    this.dataService.getEvents(reqObj).subscribe(
      (response: any) => {
        this.loader = false;
        this.disableFlag = false;
        this.totalRecords = response.body.total_records;
        if (response.status && response.statusText == 'OK') {
          if (this.selectedTab == 'today') {
            this.noDataFoundMsg = 'No Events Today';
          }
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
                if ((reqObj.event_type == 'today') && (eventdate == todayDate)) {
                  data.eventdate = todayDate;
                  data.eventtime = eventtime;
                } else if ((reqObj.event_type == 'upcoming') && (eventdate > todayDate) && flag) {
                  data.eventdate = eventdate;
                  data.eventtime = eventtime;
                  flag = false;
                } else if ((reqObj.event_type == 'past') && (eventdate < todayDate)) {
                  data.eventdate = eventdate;
                  data.eventtime = eventtime;
                }
              });
            } else {
              data.eventdate = 'Not available';
            }
          });
          if (this.selectedTab == 'upcoming') {
            this.events = [];
            const filterData = eventsData.filter((event) => {
              return event.eventdate > this.todaysDate;
            })
            // this.events = eventsData;
            this.events = filterData;
          } else {
            this.events = [];
            const sortedData = this.sortEventData(eventsData);
            this.events = sortedData;
          }
          this.infiniteScrollEnble(this.events.length, this.totalRecords);
        }
      },
      (error) => {
        this.loader = false;
        console.log('test' + error);
      }
    );
  }

  infiniteScrollEnble(length, totalRecords) {
    if (length == totalRecords) {
      this.disableInfiniteScroll = false;
    } else {
      this.disableInfiniteScroll = true;
    }
  }

  /********* filtering data based on tab selection ******/
  updateSegmentValues(allevents, selectedTab) {
    const array = [];
    allevents.forEach((event) => {
      if (event.event_date_time != null) {
        event.event_date_time.forEach((eventdatetime) => {
          const eventDate = eventdatetime.event_date;
          const eventTime = eventdatetime.event_timings[0].start_time;
          const today = new Date();
          const year = today.getFullYear();
          const month = ('0' + (today.getMonth() + 1)).slice(-2);
          const day = ('0' + today.getDate()).slice(-2);
          const todayDate = year + '-' + month + '-' + day;
          if (selectedTab == 'today') {
            if (eventDate == todayDate) {
              event.eventdate = todayDate;
              event.eventtime = eventTime;
              if (array.indexOf(event) == -1) {
                array.push(event);
              }
            }
          } else if (selectedTab == 'upcoming') {
            if (eventDate > todayDate) {
              event.eventdate = eventDate;
              event.eventtime = eventTime;
              if (array.indexOf(event) == -1) {
                array.push(event);
              }
            }
          } else if (selectedTab == 'past') {
            if (eventDate < todayDate) {
              event.eventdate = eventDate;
              event.eventtime = eventTime;
              if (array.indexOf(event) == -1) {
                array.push(event);
              }
            }
          }
        });
      }
    });
    this.events = array;
  }

  /******* open camera and scan qr code ******/
  onQrCodeClick() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        this.cameraCloseFlag = true;
        if (status.authorized) {
          const adminGlobals: any = this.dataExchangeService.getAdminGlobals();
          // camera permission was granted
          // start scanning
          this.qrScanner.show();
          this.cameraCloseFlag = true;
          window.document.querySelector('ion-app').classList.remove('nocameraView');
          window.document.querySelector('ion-app').classList.add('cameraView');
          window.document.querySelector('body').classList.add('cameraCloseIcon');
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            window.document.querySelector('ion-app').classList.remove('cameraView');
            window.document.querySelector('body').classList.remove('cameraCloseIcon');
            window.document.querySelector('ion-app').classList.add('nocameraView');
            this.qrScanner.hide(); // hide camera preview
            this.qrScanner.destroy();
            this.getTicketScanStatus(text, adminGlobals);
            scanSub.unsubscribe(); // stop scanning
          },
            (error) => {
              this.closeCameraPreview();
              this.showErrorMessage();
            });
        } else if (status.denied) {
          this.showErrorAlert('Camera access permission denied. Please enable it in the setting app');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          this.showErrorAlert('Camera access permission denied. Please enable it in the setting app');
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => {
        console.log('Error is', e)
        const message = e._message ? (e._message) : ('Error is: ' + JSON.stringify(e))
        this.showErrorAlert(message);
      });
  }

  showErrorAlert(message: string): void {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: message,
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    alert.present();
  }

  /********** close the camera and destroy camera instance **************/
  closeCameraPreview() {
    window.document.querySelector('ion-app').classList.remove('cameraView');
    window.document.querySelector('body').classList.remove('cameraCloseIcon');
    window.document.querySelector('ion-app').classList.add('nocameraView');
    this.qrScanner.hide(); // hide camera preview
    this.qrScanner.destroy();
    this.cameraCloseFlag = false;
  }

  /******** get scanned ticket status ************/
  getTicketScanStatus(text, adminGlobals) {
    this.cameraCloseFlag = false;
    let loading = this.loadingCtrl.create({
      content: 'Processing...',
      duration: 10000
    });
    loading.present();
    let sliceText= text.slice(text.lastIndexOf('/')+1, text.length);
    let device_Validated;

    if(localStorage.device_id !=undefined)
    {
      if(localStorage.device_id == sliceText)
      {
        device_Validated=true;
      }
      else
      {
        device_Validated=false;
      }
    }
    else
    {
      device_Validated=false;
    }
    const reqObj = {
      user_id: adminGlobals.user_id,
      url: text,
      event_id: '1',
      device_id: adminGlobals.device_id,
      is_device_validated:device_Validated,
      is_multiple:0,
      device:"mobile"

    };
    this.scanUrl = reqObj.url;
    this.dataService.ticketScan(reqObj)
      .timeout(10000)
      .subscribe(
        (response: any) => {
          loading.dismiss();
          if (response.body) {
            if (response.status == 200 && response.statusText === 'OK' && response.body.status === 'success') {
              this.openModal(true, response);
               localStorage.device_id = sliceText
            } else {
              this.openModal(false, response);
            }
          } else {
            this.showErrorMessage();
          }
        },
        (error) => {
          loading.dismiss();
          console.log(error);
          this.showErrorMessage();
        }
      );
  }

  showErrorMessage() {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      subTitle: 'We encountered an error while scanning. Please try again.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Scan',
        handler: () => {
          this.onQrCodeClick();
        }
      }]
    });
    alert.present();
  }

  openModal(status, response) {
    const ticketScanModal = this.modal.create(TicketscanValidationPopupPage, {
      data: status,
      responseData: response.body
    });
    ticketScanModal.onDidDismiss((data) => {
      this.onQrCodeClick();
    });
    ticketScanModal.present();
  }

  /********* refresh event screen when user pulls down the screen ******/
  doRefresh(refresher) {
    this.pageNum = {
      today: 1,
      past: 1,
      upcoming: 1
    };
    this.pageCount = 1;
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      device_id: this.adminGlobals.device_id,
      event_type: this.selectedTab,
      page_id: this.pageCount,
      per_page_limit: 10
    };
    this.dataService.getEvents(reqObj).subscribe(
      (response: any) => {
        // this.updateSegmentValues(response.body.data, this.selectedTab);
        this.totalRecords = response.body.total_records;
        refresher.complete();
        if (response.status && response.statusText == 'OK') {
          const eventsData = response.body.data;
          eventsData.forEach((data) => {
            // data.spinner = false;
            // if (data.event_date_time != null) {
            // 	data.eventdate = data.event_date_time[0].event_date;
            // 	data.eventtime = data.event_date_time[0].event_timings[0].start_time;
            // }
            let flag = true;
            let pastFlag = true;
            if (data.event_date_time != null) {
              data.event_date_time.forEach((dataItem) => {
                const eventdate = dataItem.event_date;
                const eventtime = data.event_date_time[0].event_timings[0].start_time;
                const today = new Date();
                const year = today.getFullYear();
                const month = ('0' + (today.getMonth() + 1)).slice(-2);
                const day = ('0' + today.getDate()).slice(-2);
                const todayDate = year + '-' + month + '-' + day;
                if ((reqObj.event_type == 'today') && (eventdate == todayDate)) {
                  data.eventdate = todayDate;
                  data.eventtime = eventtime;
                } else if ((reqObj.event_type == 'upcoming') && (eventdate > todayDate) && flag) {
                  data.eventdate = eventdate;
                  data.eventtime = eventtime;
                  flag = false;
                } else if ((reqObj.event_type == 'past') && (eventdate < todayDate) && pastFlag) {
                  data.eventdate = eventdate;
                  data.eventtime = eventtime;
                  pastFlag = false;
                }
              });
            } else {
              data.eventdate = 'Not available';
            }
          });
          if (this.selectedTab == 'upcoming') {
            this.events = [];
            const filterData = eventsData.filter((event) => {
              return event.eventdate > this.todaysDate;
            })
            // this.events = eventsData;
            this.events = filterData;
          } else {
            this.events = [];
            const sortedData = this.sortEventData(eventsData);
            this.events = sortedData;
          }
          this.infiniteScrollEnble(this.events.length, this.totalRecords);
          // this.updateSegmentValues(response.body.data, this.selectedTab);
        }
      },
      (error) => {
        refresher.complete();
        console.log('test' + error);
      }
    );
  }

  /************ to validate a device ***********/
  onValidateDevice(valid, data) {
    let loading = this.loadingCtrl.create({
      content: 'Validating Device...'
    });
    const adminGlobals: any = this.dataExchangeService.getAdminGlobals();
    const reqObj = {
      user_id: adminGlobals.user_id,
      event_id: data.event_id,
      device_id: adminGlobals.device_id
    };
    if (valid == true) {
      loading.present();
      this.dataService.validateDevice(reqObj).subscribe(
        (response: any) => {
          loading.dismiss();
          if (response.status == 200 && response.statusText === 'OK' && response.body.status === 'success') {
            this.popup(true);
            this.events.forEach((data) => {
              if (data.event_id == reqObj.event_id) {
                data.validate_device = true;
              }
            });
          } else {
            this.popup(false);
          }
        },
        (error: any) => {
          loading.dismiss();
          console.log(error);
        }
      );
    }
  }

  popup(status) {
    const deviceValidationModal = this.modal.create(DeviceValidationPopupPage, { data: status });
    deviceValidationModal.present();
  }

  onSearchTickets(event) {
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      event_id: event.event_id,
      keyword: '',
      page_id: 1,
      per_page_limit: 30,
      device_id: this.adminGlobals.device_id
    };
    let alert = this.alertCtrl.create({
      subTitle: 'Enter the keywords you would like to search',
      cssClass: 'searchalert',
      inputs: [
        {
          name: 'searchkey',
          placeholder: 'Name, Ticket/Seat Number',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'SEARCH',
          handler: (data: any) => {
            reqObj.keyword = data.searchkey;
            console.log(data);
            this.searchTickets(reqObj, event.event_name, event.event_id);
          }
        }
      ]
    });
    alert.present();
  }

  /******* search tickets based on keywords entered by user ******/
  searchTickets(reqObject, eventname, eventid) {
    let loading = this.loadingCtrl.create({
      content: 'Searching...'
    });
    loading.present();
    this.dataService.searchTickets(reqObject).subscribe(
      (response: any) => {
        loading.dismiss();
        this.navCtrl.push(SearchTicketPage, {
          response: response.body,
          eventname: eventname,
          eventid: eventid,
          keyword: reqObject.keyword
        });
      },
      (error: any) => {
        loading.dismiss();
        console.log(error);
      }
    );
  }

  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      if (this.selectedTab == 'today') {
        this.pageNum.today = this.pageNum.today + 1;
        this.pageCount = this.pageNum.today;
      } else if (this.selectedTab == 'past') {
        this.pageNum.past = this.pageNum.past + 1;
        this.pageCount = this.pageNum.past;
      } else if (this.selectedTab == 'upcoming') {
        this.pageNum.upcoming = this.pageNum.upcoming + 1;
        this.pageCount = this.pageNum.upcoming;
      }
      const reqObj = {
        user_id: this.adminGlobals.user_id,
        device_id: this.adminGlobals.device_id,
        event_type: this.selectedTab,
        page_id: this.pageCount,
        per_page_limit: 10
      };
      this.dataService.getEvents(reqObj).subscribe(
        (response: any) => {
          this.totalRecords = response.body.total_records;
          if (response.status && response.statusText == 'OK') {
            const allevents = response.body.data;
            allevents.forEach((data) => {
              let flag = true;
              let pastFlag = true;
              if (data.event_date_time != null) {
                data.event_date_time.forEach((dataItem) => {
                  const eventdate = dataItem.event_date;
                  const eventtime = data.event_date_time[0].event_timings[0].start_time;
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = ('0' + (today.getMonth() + 1)).slice(-2);
                  const day = ('0' + today.getDate()).slice(-2);
                  const todayDate = year + '-' + month + '-' + day;
                  if ((reqObj.event_type == 'today') && (eventdate == todayDate)) {
                    data.eventdate = todayDate;
                    data.eventtime = eventtime;
                  } else if ((reqObj.event_type == 'upcoming') && (eventdate > todayDate) && flag) {
                    data.eventdate = eventdate;
                    data.eventtime = eventtime;
                    flag = false;
                  } else if ((reqObj.event_type == 'past') && (eventdate < todayDate) && pastFlag) {
                    data.eventdate = eventdate;
                    data.eventtime = eventtime;
                    pastFlag = false;
                  }
                });
              } else {
                data.eventdate = 'Not available';
              }
            });
            if (this.selectedTab == 'upcoming') {
              const filterData = allevents.filter((event) => {
                return event.eventdate > this.todaysDate;
              })
              this.events = this.events.concat(filterData);
            } else {
              const sortedData = this.sortEventData(allevents);
              this.events = this.events.concat(sortedData);
            }

            this.infiniteScrollEnble(this.events.length, this.totalRecords);
            resolve();
          }
        },
        (error) => {
          console.log('test' + error);
          resolve();
        }
      );
    });
  }

  /************ navigating user to google maps ***********/
  navigateToMaps(venue: any) {
    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };
    this.launchNavigator.navigate(venue, options);
  }

  openEventDetails(data) {
    console.log(data);
    console.log(data.event_detail_link);
    if (this.plt.is('android') || this.plt.is('ios')) {
      this.dataExchangeService.openUrl(data.event_detail_link);
    } else {
      window.open(data.event_detail_link);
    }
  }
}
