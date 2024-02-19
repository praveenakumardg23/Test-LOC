import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicPage, ModalController, Navbar, NavController, NavParams, Platform } from 'ionic-angular';
import { DataExchangeService } from '../services/data-services/data-exchange-service';
import { DataService } from '../services/data-services/data-service';
import { TicketTransferPopupPage } from '../ticket-transfer-popup/ticket-transfer-popup';
import { TicketValidationPopupPage } from '../ticket-validation-popup/ticket-validation-popup';
import { NetworkService, ConnectionStatus } from './../services/network-services/network-service';
import { OfflineManagerService } from '../services/network-services/offline-manager-service';

/**
 * Generated class for the TicketValidateTransferViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ticket-validate-transfer-view',
  templateUrl: 'ticket-validate-transfer-view.html',
})
export class TicketValidateTransferViewPage implements OnInit {
  selectedTab: string;
  type: string;
  url = 'assets/imgs/order-defaultimg.png';
  eventData = {};
  ticketsData: any;
  accessTickets: any;
  loader = false;
  isIndeterminate: boolean;
  masterCheck: boolean;
  masterCheckDisableValidate: boolean;
  masterCheckDisableTransfer: boolean;
  @ViewChild(Navbar) navBar: Navbar;
  selectedTicket: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private modal: ModalController,
    private dataService: DataService,
    private dataExchangeService: DataExchangeService,
    public plt: Platform,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService
  ) {
    this.type = 'validate';
  }

  ngOnInit() {
    this.onGetAccessTickets();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (ev: UIEvent) => {
      if (this.type == 'view') {

        this.type = 'validate';
      } else {
        this.navCtrl.pop();
      }
    }
  }

  onBack() {
    this.navCtrl.pop();
  }

  onGetAccessTickets() {
    this.masterCheckDisableValidate = true;
    this.masterCheckDisableTransfer = true;
    this.masterCheck = false;
    const isCanArray = [];
    const isSharedArray = [];
    const eventData = this.navParams.get('data');
    const adminGlobals: any = this.dataExchangeService.getAdminGlobals();
    const reqObj = {
      user_id: adminGlobals.user_id,
      order_id: eventData.order_id,
      is_shared: eventData.is_shared,
      device_id: adminGlobals.device_id,
    };
    this.eventData = eventData;
    this.loader = true;
    this.dataService.accessTickets(reqObj).subscribe(
      (response: any) => {
        this.loader = false;
        this.accessTickets = response.body.data;
        this.ticketsData = response.body.data.tickets;
        this.ticketsData.forEach((data: any, index) => {
          if (data.is_can) {
            isCanArray.push(data.is_can);
          }
          if (!data.shared_ticket) {
            isSharedArray.push(data.is_can);
          }
          data.isDisabled = false;
          data.isVisible = true;
          data.isChecked = false
        });
        if (isCanArray.length > 0) {
          this.masterCheckDisableValidate = false;
        } else {
          this.masterCheckDisableValidate = true;
        }
        if (isSharedArray.length > 0) {
          this.masterCheckDisableTransfer = false;
        } else {
          this.masterCheckDisableTransfer = true;
        }
      },
      (error) => {
        this.loader = false;
        console.log(error);
      });
  }

  onOrderData(selectedTab: string): void {
    this.selectedTab = selectedTab;
    if (selectedTab == 'validate') {
      this.ticketsData.forEach((ticket: any) => {
        if (ticket.is_can == 0) {
          ticket.isChecked = false;
        }
      })
    } else if (selectedTab == 'transfer') {
      this.ticketsData.forEach((ticket: any) => {
        if (!(ticket.shared_ticket == '')) {
          ticket.isChecked = false;
        }
      })
    }
    const checkedData = this.ticketsData.filter((data: any) => {
      if (data.isChecked) {
        return data;
      }
    });
    if ((checkedData.length == this.ticketsData.length) && (checkedData.length != 0)) {
      this.masterCheck = true;
    } else {
      this.masterCheck = false;
    }
  }

  onValidateTickets() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to validate the selected tickets?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.loader = true;
            const reqObj = this.getReqObj('validate');
            if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
              this.offlineManager.storeRequest(reqObj);
            } else {
              this.dataService.validateTickets(reqObj).subscribe(
                (response: any) => {
                  this.loader = false;
                  if (response.body.status == 'success') {
                    this.onGetAccessTickets();
                    this.popup(true, response.body.message);
                  } else if (response.body.status == 'error') {
                    this.popup(false, response.body.message);
                  }
                },
                (error) => {
                  this.loader = false;
                  console.log(error);
                });
            }
          }
        }
      ]
    });
    alert.present();
  }

  getReqObj(type) {
    const selectedTickts = [];
    this.ticketsData.forEach(data => {
      if (data.isChecked && (type == 'validate' ? (data.is_can) : (data.shared_ticket == ''))) {
        selectedTickts.push(data.id);
      }
    });
    const adminGlobals: any = this.dataExchangeService.getAdminGlobals();
    const reqObj: any = {
      user_id: adminGlobals.user_id,
      device_id: adminGlobals.device_id,
      event_id: this.accessTickets.event_id,
    }
    if (type == 'validate') {
      reqObj.tickets = selectedTickts;
    } else {
      reqObj.ticket_id = selectedTickts;
    }
    return reqObj;
  }

  onTransferTickets() {
    const reqObj: any = this.getReqObj('transfer');
    reqObj.order_id = this.accessTickets.order_id;
    reqObj.authorize_token = '';
    delete reqObj.event_id;
    const ticketTransferModal = this.modal.create(TicketTransferPopupPage, { data: reqObj }, { cssClass: 'transfer-ticket-class' });
    ticketTransferModal.onDidDismiss((data) => {
      if (data.dismissvalue == "success") {
        this.onGetAccessTickets();
        this.type = 'validate';
      }
    })
    ticketTransferModal.present();
  }

  popup(status: boolean, message: string) {
    const deviceValidationModal = this.modal.create(TicketValidationPopupPage, { data: status, message: message });
    deviceValidationModal.present();
  }

  openUrlInBrower(url: string): void {
    this.dataExchangeService.openUrl(url);
  }

  redirectToViewTickets(ticketData, index: number): void {
    this.selectedTicket = {
      data: ticketData,
      ticketIndex: index
    }
    this.type = 'view';
  }

  checkMaster(): void {
    setTimeout(() => {
      this.ticketsData.forEach(obj => {
        obj.isChecked = (this.type == 'validate') ? (obj.is_can ? this.masterCheck : false) : ((obj.shared_ticket == "") ? this.masterCheck : false);
      });
    });
  }

  checkEvent(): void {
    const filteredTicketData = this.ticketsData.filter((obj) => {
      if (this.type == 'validate' && obj.is_can) {
        return obj;
      }
      if (this.type == 'transfer' && !obj.shared_ticket) {
        return obj;
      }
    });
    const totalItems = filteredTicketData.length;
    let checked = 0;
    this.ticketsData.map(obj => {
      if (obj.isChecked) checked++;
    });
    if (checked > 0 && checked < totalItems) {
      //If even one item is checked but not all
      this.isIndeterminate = true;
      this.masterCheck = false;
    } else if (checked != 0 && (checked == totalItems)) {
      //If all are checked
      this.masterCheck = true;
      this.isIndeterminate = false;
    } else {
      //If none is checked
      this.isIndeterminate = false;
      this.masterCheck = false;
    }
  }

  getStatus(type): boolean {
    let checked = 0;
    this.ticketsData.map(obj => {
      if (obj.isChecked) checked++;
    });
    if (type == 'validate') {
      return (checked <= 0);
    } else if (type == 'transfer') {
      return (checked <= 0);
    }
  }

}
