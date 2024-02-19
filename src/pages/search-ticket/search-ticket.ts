import { ManualscanValidationPopupPage } from './../manualscan-validation-popup/manualscan-validation-popup';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { DataService } from './../services/data-services/data-service';
/**
 * Generated class for the SearchTicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-ticket',
  templateUrl: 'search-ticket.html'
})
export class SearchTicketPage implements OnInit {
  ticketsData: any;
  fullticketsData: any;
  searchInput: string;
  eventname: string;
  eventid: string;
  adminGlobals: any;
  clickedId = -1;
  clickedIndex: number;
  apiStatus: string;
  disableInfiniteScroll = false;
  pageCount = 2;
  keyword = '';
  displayDate = [];
  noTicketsData = false;
  isSeatMapped: number;
  loader = false;
  buyerSortDesc = '';
  dateSortDesc = '';
  seatSortDesc = '';
  scanStatusSortDesc = '';
  sortValue = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    platform: Platform,
    private dataExchangeService: DataExchangeService,
    private dataService: DataService,
    public plt: Platform,
    private modal: ModalController
  ) {
    platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchTicketPage');
  }

  ionViewWillEnter() {
    this.isSeatMapped = this.navParams.get('response').is_seat_mapped;
    const ticketsResponse = this.navParams.get('response').data;
    if (ticketsResponse != null) {
      // ticketsResponse.sort(function (a, b) {
      //   let c1, c2;
      //   if (b.seat_number && a.seat_number) {
      //     c1 = b.seat_number;
      //     c2 = a.seat_number;
      //     // return b.seat_number > a.seat_number;
      //   } else if (b.ticket_number && a.ticket_number) {
      //     c1 = b.ticket_number;
      //     c2 = a.ticket_number;
      //     // return b.ticket_number > a.ticket_number;
      //   } else if (b.seat_number && a.ticket_number) {
      //     c1 = b.seat_number;
      //     c2 = a.ticket_number;
      //     // return b.seat_number > a.ticket_number
      //   } else if (b.ticket_number && a.seat_number) {
      //     c1 = b.ticket_number;
      //     c2 = a.seat_number;
      //     // return b.ticket_number > a.seat_number
      //   }

      //   if (c2 > c1) return 1;
      //   if (c2 < c1) return -1;
      //   return 0;
      // });

      // ticketsResponse.sort(function (a, b) {
      //   // return b.event_date > a.event_date;
      //   const c1 = a.event_date;
      //   const c2 = b.event_date;
      //   if (c1 > c2) return 1;
      //   if (c1 < c2) return -1;
      //   return 0;
      // });

      ticketsResponse.forEach((data) => {
        if (data.last_scanned == '') {
          data.button_value = 'SCAN';
        } else {
          data.button_value = data.last_scanned;
        }

        if (this.displayDate.length == 0) {
          this.displayDate.push(data.event_date);
          data.displayDate = true;
        } else {
          const eventDateCheck = this.displayDate.indexOf(data.event_date);
          if (eventDateCheck == -1) {
            this.displayDate.push(data.event_date);
            data.displayDate = true;
          } else {
            data.displayDate = false;
          }
        }

      });
    }
    // console.log(ticketsResponse);
    this.ticketsData = ticketsResponse;
    this.ticketsData.sort((b, a) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
    if (this.ticketsData.length == 0) {
      this.noTicketsData = true;
    }
    this.eventname = this.navParams.get('eventname');
    this.keyword = this.navParams.get('keyword');
    this.eventid = this.navParams.get('eventid');
    this.fullticketsData = this.ticketsData;
  }

  ngOnInit() {
    this.disableInfiniteScroll = true;
    this.adminGlobals = this.dataExchangeService.getAdminGlobals();
  }

  /****** scanning the tickets manually ******/
  onScanTickets(ticketData, index) {
    this.apiStatus = '';
    this.clickedId = index;
    this.clickedIndex = index;
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      device_id: this.adminGlobals.device_id,
      event_id: this.eventid,
      ticket_id: ticketData.ticket_id
    };

    this.dataService.scanTickets(reqObj).subscribe(
      (response: any) => {
        this.clickedId = -1;
        if (response.body) {
          if (response.status == 200 && response.statusText === 'OK' && response.body.status === 'success') {
            this.ticketsData.forEach((data) => {
              if (reqObj.ticket_id == data.ticket_id) {
                data.button_value = response.body.data;
              }

              // if (this.displayDate.length == 0) {
              //   this.displayDate.push(data.event_date);
              //   data.displayDate = true;
              // } else {
              //   const eventDateCheck = this.displayDate.indexOf(data.event_date);
              //   if (eventDateCheck == -1) {
              //     this.displayDate.push(data.event_date);
              //     data.displayDate = true;
              //   } else {
              //     data.displayDate = false;
              //   }
              // }
            });
            this.apiStatus = 'success';
            this.openModal(true, response);
          } else {
            this.apiStatus = 'failure';
            this.openModal(false, response);
          }
        } else {
          this.apiStatus = 'failure';
          const errorData = {
            body: {
              message: 'We encountered an error while scanning. Please try again.',
              data: null
            }
          }
          this.openModal(false, errorData);
        }
      },
      (error) => {
        console.log(error);
        this.openModal(false, error);
      }
    );
  }

  openModal(status, response) {
    const manualScanModal = this.modal.create(ManualscanValidationPopupPage, {
      data: status,
      responseData: response.body
    });
    // ticketScanModal.onDidDismiss(data => {

    // });
    manualScanModal.present();
  }

  // onSearchInput(ev:any) {
  //   const val = ev.target.value;
  //   console.log(val);
  // }
  /**** filtering the ticket result list based on user entry ****/
  onSearchBarInput(ev: any) {
    // this.noTicketsData = false;
    // Reset items back to all of the items
    // this.ticketsData = this.fullticketsData;
    // set val to the value of the searchbar
    const val = ev.target.value;
    // console.log(val);
    this.keyword = val;
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      event_id: this.eventid,
      keyword: this.keyword,
      page_id: 1,
      per_page_limit: 30,
      device_id: this.adminGlobals.device_id
    };
    // console.log(reqObj);
    this.getTicketsData(reqObj);
    // if the value is an empty string don't filter the items
    // if (val && val.trim() != '') {
    // 	this.ticketsData = this.ticketsData.filter((item) => {
    // 		const ticketNum = item.access_type == 'Seat Number' ? item.seat_number : item.ticket_number;
    // 		return (
    // 			item.first_name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
    // 			item.last_name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
    // 			ticketNum.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
    // 		);
    // 	});
    // }
    // if (this.ticketsData.length == 0) {
    // 	this.noTicketsData = true;
    // }
  }

  /**** cancel click in searchbar showing full data ****/
  onSearchBarCancel() {
    this.keyword = '';
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      event_id: this.eventid,
      keyword: this.keyword,
      page_id: 1,
      per_page_limit: 30,
      device_id: this.adminGlobals.device_id
    };
    // console.log(reqObj);
    this.getTicketsData(reqObj);
    // this.ticketsData = this.fullticketsData;
    // if (this.ticketsData.length == 0) {
    // 	this.noTicketsData = true;
    // } else {
    // 	this.noTicketsData = false;
    // }
  }

  /** return event name to display **/
  getEventName() {
    return this.eventname;
  }

  sort(type) {
    this.sortValue = type;
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      event_id: this.eventid,
      keyword: this.keyword,
      page_id: 1,
      per_page_limit: 30,
      device_id: this.adminGlobals.device_id,
      sort_id: type,
      currentclass: this.getCurrentClass(type)
    };
    console.log(reqObj);
    this.getTicketsData(reqObj);
  }

  getCurrentClass(type) {
    if (type == 'buyer_sort') {
      return this.buyerSortDesc = (this.buyerSortDesc == 'asc' || this.buyerSortDesc == '') ? 'desc' : 'asc';
    } else if (type == 'date_sort') {
      return this.dateSortDesc = (this.dateSortDesc == 'asc' || this.dateSortDesc == '') ? 'desc' : 'asc';
    } else if (type == 'seat_sort') {
      return this.seatSortDesc = (this.seatSortDesc == 'asc' || this.seatSortDesc == '') ? 'desc' : 'asc';
    } else if (type == 'scan_status_sort') {
      return this.scanStatusSortDesc = (this.scanStatusSortDesc == 'asc' || this.scanStatusSortDesc == '') ? 'desc' : 'asc';
    } else {
      return '';
    }
  }

  getCurrentClassForInfiniteScroll(type) {
    if (type == 'buyer_sort') {
      return this.buyerSortDesc;
    } else if (type == 'date_sort') {
      return this.dateSortDesc;
    } else if (type == 'seat_sort') {
      return this.seatSortDesc;
    } else if (type == 'scan_status_sort') {
      return this.scanStatusSortDesc;
    } else {
      return '';
    }
  }

  openOrderDetails(data) {
    if (this.plt.is('android') || this.plt.is('ios')) {
      this.dataExchangeService.openUrl(data.event_detail_link);
    } else {
      window.open(data.event_detail_link);
    }
  }

  doInfinite(infiniteScroll) {
    // console.log(infiniteScroll);
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      event_id: this.eventid,
      keyword: this.keyword,
      page_id: this.pageCount,
      per_page_limit: 30,
      device_id: this.adminGlobals.device_id,
      sort_id: this.sortValue,
      currentclass: this.getCurrentClassForInfiniteScroll(this.sortValue)
    };
    return new Promise((resolve) => {
      this.dataService.searchTickets(reqObj).subscribe(
        (response: any) => {
          this.pageCount = this.pageCount + 1;
          const ticketsResponse = response.body.data;
          const totalRecords = response.body.total_records;
          if (ticketsResponse != null) {
            // ticketsResponse.sort(function (a, b) {
            //   let c1, c2;
            //   if (b.seat_number && a.seat_number) {
            //     c1 = b.seat_number;
            //     c2 = a.seat_number;
            //     // return b.seat_number > a.seat_number;
            //   } else if (b.ticket_number && a.ticket_number) {
            //     c1 = b.ticket_number;
            //     c2 = a.ticket_number;
            //     // return b.ticket_number > a.ticket_number;
            //   } else if (b.seat_number && a.ticket_number) {
            //     c1 = b.seat_number;
            //     c2 = a.ticket_number;
            //     // return b.seat_number > a.ticket_number
            //   } else if (b.ticket_number && a.seat_number) {
            //     c1 = b.ticket_number;
            //     c2 = a.seat_number;
            //     // return b.ticket_number > a.seat_number
            //   }

            //   if (c2 > c1) return 1;
            //   if (c2 < c1) return -1;
            //   return 0;
            // });

            // ticketsResponse.sort(function (a, b) {
            //   // return b.event_date > a.event_date;
            //   const c1 = a.event_date;
            //   const c2 = b.event_date;
            //   if (c1 > c2) return 1;
            //   if (c1 < c2) return -1;
            //   return 0;
            // });

            ticketsResponse.forEach((data) => {
              if (data.last_scanned == '') {
                data.button_value = 'SCAN';
              } else {
                data.button_value = data.last_scanned;
              }

              if (this.displayDate.length == 0) {
                this.displayDate.push(data.event_date);
                data.displayDate = true;
              } else {
                const eventDateCheck = this.displayDate.indexOf(data.event_date);
                if (eventDateCheck == -1) {
                  this.displayDate.push(data.event_date);
                  data.displayDate = true;
                } else {
                  data.displayDate = false;
                }
              }
            });
          }
          ticketsResponse.sort((b, a) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
          this.ticketsData = this.ticketsData.concat(ticketsResponse);

          if (this.ticketsData.length == 0) {
            this.noTicketsData = true;
          }
          this.fullticketsData = this.fullticketsData.concat(ticketsResponse);
          resolve();
          this.infiniteScrollEnble(this.ticketsData.length, totalRecords);
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

  getTicketsData(reqObj) {
    this.displayDate = [];
    this.loader = true;
    this.dataService.searchTickets(reqObj).subscribe(
      (response: any) => {
        this.loader = false;
        const ticketsResponse = response.body.data;
        const totalRecords = response.body.total_records;
        if (ticketsResponse != null) {
          ticketsResponse.forEach((data) => {
            if (data.last_scanned == '') {
              data.button_value = 'SCAN';
            } else {
              data.button_value = data.last_scanned;
            }

            if (this.displayDate.length == 0) {
              this.displayDate.push(data.event_date);
              data.displayDate = true;
            } else {
              const eventDateCheck = this.displayDate.indexOf(data.event_date);
              if (eventDateCheck == -1) {
                this.displayDate.push(data.event_date);
                data.displayDate = true;
              } else {
                data.displayDate = false;
              }
            }
          });
        }
        this.ticketsData = ticketsResponse;
        if (this.ticketsData.length == 0) {
          this.noTicketsData = true;
        }
        this.fullticketsData = this.ticketsData;
        this.infiniteScrollEnble(this.ticketsData.length, totalRecords)
      },
      (error) => {
        this.loader = false;
        console.log('test' + error);
      }
    );
  }
}
