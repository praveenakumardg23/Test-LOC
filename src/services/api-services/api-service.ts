import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppConfiguration } from './../../app-configuration';

import { DataExchangeService } from './../../pages/services/data-services/data-exchange-service';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ApiService {
	constructor(
		private http: HttpClient,
		private dataExchangeService: DataExchangeService,
		public appConfiguration: AppConfiguration,
		private toastCtrl: ToastController
	) {}

	get(url) {
		const headers = this.getHeaders();
		return this.http
			.get(url, {
				observe: 'response',
				headers: headers
			})
			.map((response) => {
				return response;
			})
			.catch((error) => {
				this.showErrorToast();
				return error;
			});
	}

	post(url: string, payload: {}) {
		const headers = this.getHeaders();
		return this.http
			.post(url, payload, {
				observe: 'response',
				headers: headers
			})
			.map((response) => {
				return response;
			})
			.catch((error) => {
				this.showErrorToast();
				return error;
			});
	}

	getHeaders() {
		let adminGlobals: any = this.dataExchangeService.getAdminGlobals();

		if (adminGlobals === null || !adminGlobals || (adminGlobals.length == 0)) {
			return new HttpHeaders().set('Auth-Token', 'TOKEN ' + this.appConfiguration.token);
		} else {
			return new HttpHeaders().set('Auth-Token', 'TOKEN ' + adminGlobals.authorize_token);
		}
	}

	showErrorToast() {
		const toast = this.toastCtrl.create({
			message: 'Oops! Something went wrong. Please try again later',
			position: 'top',
			duration: 5000,
			cssClass: 'toast-login',
			showCloseButton: true,
			closeButtonText: 'x'
		  });
		  toast.present();
	}
}
