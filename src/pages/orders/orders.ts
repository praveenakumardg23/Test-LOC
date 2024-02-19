import { EventVenuePopoverPage } from './../event-venue-popover/event-venue-popover';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, PopoverController, Platform } from 'ionic-angular';

import { Orders } from '../shared/orders.model';
import { DataService } from './../services/data-services/data-service';
import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { OrderDetailPage } from '../order-detail/order-detail';
import { TicketValidateTransferViewPage } from '../ticket-validate-transfer-view/ticket-validate-transfer-view';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage implements OnInit {
  adminGlobals: any;
  Orders: string;
  disableFlag = false;
  orders: Orders[];
  loader = false;
  noDataFoundMsg: string;
  allorders: Orders[];
  selectedTab: string;
  reqObject: any;
  orderLength: number;
  // url = 'assets/imgs/localevel_logoi3.png';
  url = 'assets/imgs/order-defaultimg.png';
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataExchangeService: DataExchangeService,
    private dataService: DataService,
    public popoverCtrl: PopoverController,
    public plt: Platform
  ) {
    this.Orders = 'TODAY';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

  ngOnInit() {
    this.loader = true;
    this.adminGlobals = this.dataExchangeService.getAdminGlobals();
    const reqObj = {
      user_id: this.adminGlobals.user_id,
      device_id: this.adminGlobals.device_id,
    };
    this.reqObject = reqObj;
    this.dataService.getMyorders(reqObj).subscribe(
      (response: any) => {
        this.loader = false;
        this.allorders = response.body.data;
        this.onOrderData('today');
      },
      (error) => {
        this.loader = false;
        console.log('test' + error);
      }
    );
  }

  onOrderData(selectedTab) {
    this.selectedTab = selectedTab;
    this.content.scrollToTop();
    if (selectedTab == 'today') {
      this.updateSegmentValues(this.allorders, selectedTab);
      this.noDataFoundMsg = 'No Events Today';
    } else if (selectedTab == 'upcoming') {
      this.updateSegmentValues(this.allorders, selectedTab);
      this.noDataFoundMsg = 'No Upcoming Events';
    } else if (selectedTab == 'past') {
      this.updateSegmentValues(this.allorders, selectedTab);
      this.noDataFoundMsg = 'No Events Found';
    }
  }

  /********* filtering data based on tab selection ******/
  updateSegmentValues(allorders, selectedTab) {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const todayDate = year + '-' + month + '-' + day;


    if (selectedTab == 'today') {
      this.orders = allorders.filter((order) => {
        return order.event_date == todayDate;
      })
    } else if (selectedTab == 'upcoming') {
      this.orders = allorders.filter((order) => {
        return order.event_date > todayDate;
      })
      this.sortReverseOrdersData(this.orders);
    } else if (selectedTab == 'past') {
      this.orders = allorders.filter((order) => {
        return order.event_date < todayDate;
      })
    }
    this.orderLength = this.orders.length;
  }

  /********* refresh order screen when user pulls down the screen ******/
  doRefresh(refresher) {
    this.dataService.getMyorders(this.reqObject).subscribe(
      (response: any) => {
        this.updateSegmentValues(response.body.data, this.selectedTab);
        refresher.complete();
        if (response.status && response.statusText == 'OK') {
          this.allorders = response.body.data;
          if (this.selectedTab == 'upcoming') {
            this.sortReverseOrdersData(this.allorders);
          } else {
            this.sortOrdersData(this.allorders);
          }
          this.updateSegmentValues(this.allorders, this.selectedTab);
        }
      },
      (error) => {
        refresher.complete();
        console.log('test' + error);
      }
    );
  }

  /********** sort event data **************/
  sortOrdersData(data: any) {
    return data.sort((a, b) => {
      return <any>new Date(b.event_date) - <any>new Date(a.event_date);
    });
  }

  /********** sort event data **************/
  sortReverseOrdersData(data: any) {
    return data.sort((a, b) => {
      return <any>new Date(a.event_date) - <any>new Date(b.event_date);
    });
  }

  /**** show popover on click of venue to display venue address and location icon*****/
  showVenuePopOver(myEvent, eventData) {
    let popover = this.popoverCtrl.create(EventVenuePopoverPage, { data: eventData });
    popover.present({
      ev: myEvent
    });
  }

  onViewDetails(eventData) {
    console.log(eventData);
    // eventData.vaidate_attendance = "3";
    this.dataExchangeService.removeEventTickets();
    if (eventData.vaidate_attendance == "3") {
      this.navCtrl.push(OrderDetailPage, { data: eventData });
    } else {
      this.navCtrl.push(TicketValidateTransferViewPage, { data: eventData });
    }
  }

  openEventDetails(data) {
    console.log(data);
    console.log(data.event_detail_link);
    if(this.plt.is('android') || this.plt.is('ios')){
      this.dataExchangeService.openUrl(data.event_detail_link);
    } else {
      window.open(data.event_detail_link);
    }
  }
}
