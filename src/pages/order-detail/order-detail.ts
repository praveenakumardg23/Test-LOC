import { ShareTicketPopupPage } from './../share-ticket-popup/share-ticket-popup';
import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { Component, Input, OnInit } from '@angular/core';
import { IonicPage, NavParams, Platform, LoadingController, ModalController } from 'ionic-angular';
import 'rxjs/Rx';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Storage } from '@ionic/storage';
import { TicketTransferPopupPage } from '../ticket-transfer-popup/ticket-transfer-popup';

// import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { DataService } from './../services/data-services/data-service';
/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-order-detail',
	templateUrl: 'order-detail.html'
})
export class OrderDetailPage implements OnInit {
	state = 'normal';
	adminGlobals: any;
	ticketData: any;
	loader = false;
	count = 0;
	orderId: number;
	ticketDataLength = -1;
	ticketCoachMarkFlag = true;
	// @Input() ticketDataFromApi: any;
	@Input() selectedTicketData: any;
	eventData: any;
	eventTickets = [];
	constructor(
		private dataService: DataService,
		private dataExchangeService: DataExchangeService,
		public navParams: NavParams,
		private screenOrientation: ScreenOrientation,
		public loadingCtrl: LoadingController,
		private modal: ModalController,
		public platform: Platform,
		private storage: Storage
	) { }

	ngOnInit() {
		// lock the screen to portrait
		if (!this.platform.is('core')) {
			this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
		}
		
		this.storage.get('ticketCoachMark').then((val) => {

			if (val) {
				this.ticketCoachMarkFlag = true;
			} else {
				this.ticketCoachMarkFlag = false;
			}
		})
		this.loader = true;
		this.eventData = this.navParams.get('data');
		this.adminGlobals = this.dataExchangeService.getAdminGlobals();
		this.eventTickets = this.dataExchangeService.getEventTickets();
		this.orderId = this.eventData.order_id;
		const reqObj = {
			user_id: this.adminGlobals.user_id,
			order_id: this.eventData.order_id
		};
		
		if (this.eventTickets) {
			this.ticketData = this.eventTickets;
			this.processTicketData();
		} else {
			this.dataService.getTickets(reqObj).subscribe(
				(response: any) => {
					this.ticketData = response.body.data;
					this.dataExchangeService.setEventTickets(response.body.data);
					this.processTicketData();
				},
				(error) => {
					console.log(error);
					this.loader = false;
				}
			);
		}

	}
	ionViewDidLeave() {
		// allow user rotate
		this.screenOrientation.unlock();
		this.selectedTicketData = null;
	}

	processTicketData() {
		this.ticketDataLength = this.ticketData.length;
		this.ticketData.sort(function (a, b) {
			return a.ticket_id - b.ticket_id;
		});
		this.ticketData.forEach((ticket, index) => {
			if (ticket.scanned_status == 1 || ticket.shared_status == 1 || ticket.ticket_status == 1) {
				ticket.flipImageFlag = true;
			} else if (ticket.scanned_status == 0) {
				ticket.flipImageFlag = false;
			}
			if (this.selectedTicketData && this.selectedTicketData.ticketIndex) {
				const selectedTicketIndex = this.selectedTicketData.ticketIndex;
				setTimeout(() => {
					if (index == selectedTicketIndex) {
						window.document.getElementById('select-card-' + index).classList.add('top-card');
					} else if (index == (selectedTicketIndex + 1)) {
						window.document.getElementById('select-card-' + index).classList.add('middle-card');
					} else if (index == (selectedTicketIndex + 2)) {
						window.document.getElementById('select-card-' + index).classList.add('last-card');
					} else {
						window.document.getElementById('select-card-' + index).classList.add('hide-card');
					}
					if (index == this.ticketData.length - 1) {
						this.loader = false;
						this.ticketData = this.ticketData;
					}
					if (selectedTicketIndex) {
						this.count = selectedTicketIndex;
					}
				}, 500);
			} else {
				setTimeout(() => {
					if (index == 0) {
						window.document.getElementById('select-card-' + index).classList.add('top-card');
					} else if (index == 1) {
						window.document.getElementById('select-card-' + index).classList.add('middle-card');
					} else if (index == 2) {
						window.document.getElementById('select-card-' + index).classList.add('last-card');
					} else {
						window.document.getElementById('select-card-' + index).classList.add('hide-card');
					}
					if (index == this.ticketData.length - 1) {
						this.loader = false;
						this.ticketData = this.ticketData;
					}
				}, 500);
			}
		});
	}

	onGotIt() {
		this.storage.set('ticketCoachMark', true)
		this.ticketCoachMarkFlag = true;
	}

	onSwipeArrow(direction: number) {
		const e = {
			direction: direction
		}
		this.swipeScreen(e)
	}

	swipeScreen(e) {
		if (e.direction == 8) {
			if (this.count < this.ticketData.length - 1) {
				window.document.getElementById('select-header-' + this.count).classList.add('hidden-card');
				window.document.getElementById('select-line-' + this.count).classList.add('hidden-card');
				window.document.getElementById('select-content-' + this.count).classList.add('hidden-card');
				window.document.getElementById('select-card-' + this.count).classList.remove('bounce');
				window.document.getElementById('select-card-' + this.count).classList.add('fadeOutUpCustom');
				setTimeout(() => {
					window.document.getElementById('select-card-' + (this.count + 1)).classList.add('top-card');
					window.document.getElementById('select-card-' + (this.count + 1)).classList.remove('middle-card');
					if (this.count < this.ticketData.length - 2) {
						window.document.getElementById('select-card-' + (this.count + 2)).classList.add('middle-card');
						window.document.getElementById('select-card-' + (this.count + 2)).classList.remove('last-card');
					}
					if (this.count < this.ticketData.length - 3) {
						window.document.getElementById('select-card-' + (this.count + 3)).classList.remove('bounce');
						window.document.getElementById('select-card-' + (this.count + 3)).classList.add('last-card');
						window.document.getElementById('select-card-' + (this.count + 3)).classList.remove('hide-card');
					}
					// window.document.getElementById('select-card-' + this.count).classList.add('hidden-card');
					window.document.getElementById('select-card-' + this.count).classList.remove('top-card');
					this.count++;
				}, 60);
			}
		} else if (e.direction == 16) {
			if (this.count != 0) {
				window.document.getElementById('select-card-' + (this.count - 1)).classList.remove('fadeOutUpCustom');
				window.document.getElementById('select-card-' + (this.count - 1)).classList.add('bounceInDown');
				setTimeout(() => {
					window.document.getElementById('select-header-' + (this.count - 1)).classList.remove('hidden-card');
					window.document.getElementById('select-line-' + (this.count - 1)).classList.remove('hidden-card');
					window.document.getElementById('select-content-' + (this.count - 1)).classList.remove('hidden-card');
					window.document.getElementById('select-card-' + (this.count - 1)).classList.remove('hide-card');
					window.document.getElementById('select-card-' + (this.count - 1)).classList.add('top-card');
					window.document.getElementById('select-card-' + this.count).classList.remove('top-card');
					window.document.getElementById('select-card-' + this.count).classList.add('middle-card');

					if (this.count < this.ticketData.length - 1) {
						window.document
							.getElementById('select-card-' + (this.count + 1))
							.classList.remove('middle-card');
						window.document.getElementById('select-card-' + (this.count + 1)).classList.add('last-card');
					}
					this.count--;
				}, 200);
			}
		}
	}

	flipImage(index, ticketId) {
		this.ticketData.forEach((ticket) => {
			if (ticket.ticket_id == ticketId && (ticket.scanned_status == 1 || ticket.shared_status == 1)) {
				
				if (ticket.ticket_status != 1) {
					ticket.flipImageFlag = !ticket.flipImageFlag;
				}
			}
		});
	}

	onShareButton(ticketData) {
		const reqObj: any = {
			user_id: this.adminGlobals.user_id,
			order_id: this.orderId,
			ticket_id: [ticketData.ticket_id],
			authorize_token : '',
			device_id: this.adminGlobals.device_id
		}
		

		const ticketTransferModal = this.modal.create(TicketTransferPopupPage, { data: reqObj }, { cssClass: 'transfer-ticket-class' });
		ticketTransferModal.onDidDismiss((data) => {
		  if (data.dismissvalue == "success") {

		this.ticketData.forEach((ticket) => {
				if (ticket.ticket_id == ticketData.ticket_id && data) {
					ticket.shared_status = 1;
					ticket.shared_email = data.value;
					ticket.flipImageFlag = true;
				}
			});
		  }
		})
		ticketTransferModal.present();
	  
       
	}

	openModal(status, response, emailid, ticketValue) {
		const ticketScanModal = this.modal.create(
			ShareTicketPopupPage,
			{
				data: status,
				responseData: response.body,
				emailId: emailid
			},
			{ cssClass: 'modal-shareticket' }
		);
		ticketScanModal.onDidDismiss((data) => {
			this.ticketData.forEach((ticket) => {
				if (ticket.ticket_id == ticketValue.ticket_id && data) {
					ticket.shared_status = 1;
					ticket.shared_email = emailid;
					ticket.flipImageFlag = true;
				}
			});
		});
		ticketScanModal.present();
	}

	validateEmail(data) {
		if (/(.+)@(.+){2,}\.(.+){2,}/.test(data.email)) {
			return {
				isValid: true,
				message: ''
			};
		} else {
			return {
				isValid: false,
				message: 'Email address is required'
			};
		}
	}


}
