import { ApiService } from '../../../services/api-services/api-service';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { AppConfiguration } from './../../../app-configuration';

@Injectable()
export class DataService {
	url = this.appConfiguration.url;
	constructor(private apiService: ApiService, public appConfiguration: AppConfiguration) {}

	login(payload) {
		return this.apiService.post(this.url + '/users/login', payload);
  }

  logout(payload) {
		return this.apiService.post(this.url + '/users/logout', payload);
  }

  getEvents(payload) {
    return this.apiService.post(this.url + '/events/myEvents',payload)
  }

  validateDevice(payload){
    return this.apiService.post(this.url + '/events/validateDevice' , payload);
  }

  ticketScan(payload) {
    return this.apiService.post(this.url + '/events/ticketScan', payload); //qrcode scan
  }

  scanTickets(payload){
    return this.apiService.post(this.url + '/events/scanTickets', payload); //manual scan
  }

  userSetting(payload) {
    return this.apiService.post(this.url + '/users/userSettings', payload);
  }

  searchTickets(payload){
    return this.apiService.post(this.url + '/events/searchTickets', payload);
  }

  getMyorders(payload){
    return this.apiService.post(this.url + '/events/getMyorders', payload);
  }

  getTickets(payload){
    return this.apiService.post(this.url + '/events/getTickets', payload);
  }

  accessTickets(payload){
    return this.apiService.post(this.url + '/events/accessTickets', payload);
  }

  validateTickets(payload){
    return this.apiService.post(this.url + '/events/validateTickets', payload);
  }

  TransferTicketsSMS(payload){
    return this.apiService.post(this.url + '/events/TransferTicketsSMS', payload);
  }

  shareTickets(payload){
    return this.apiService.post(this.url + '/events/shareTickets', payload);
  }

  searchEvents(payload){
    return this.apiService.post(this.url + '/events/searchEvents', payload);
  }

  eventDetails(payload) {
    return this.apiService.post(this.url + '/events/eventDetails', payload);
  }

  getDomainList(payload) {
    return this.apiService.post(this.url + '/domains/domainList', payload);
  }
}
