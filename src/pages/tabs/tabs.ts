import { AppConfiguration } from './../../app-configuration';
import { DataService } from './../services/data-services/data-service';
import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { SearchPage } from './../search/search';
import { OrdersPage } from './../orders/orders';
import { EventsPage } from './../events/events';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit{
  eventsPage = EventsPage;
  ordersPage = OrdersPage;
  searchPage = SearchPage;
  settingsPage = SettingsPage;
  adminGlobals:any
  domain: string;
  constructor(private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private dataExchangeService: DataExchangeService,
    private dataService: DataService,
    public loadingCtrl: LoadingController,
    public plt: Platform,
    public appConfiguration: AppConfiguration) {
      // this.domain = appConfiguration.domain;
      this.storage.get('selectedDomain').then((val) => {
        if(val) {
          this.domain = val.id;
        }
      })
  }

  ngOnInit() {
    this.adminGlobals= this.dataExchangeService.getAdminGlobals();

  }

  /****** logout the user and redirect to login page******/
  onLogout() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    const reqObj = {
      "user_id": this.adminGlobals.user_id,
      "token": this.adminGlobals.authorize_token,
      "device_id": this.adminGlobals.device_id
    }
    this.dataService.logout(reqObj)
    .subscribe((response: any) => {
      loading.dismiss();
      if(response.status == 200 && response.statusText === 'OK' && response.body.status === 'success'){
        // this.storage.clear();
        this.storage.remove('adminGlobals');
        this.dataExchangeService.removeAdminGlobals();
        this.app.getRootNav().setRoot(LoginPage);
      }
    })
  }

  /********* get user setting url ***********/
  onSettings() {
    let loading = this.loadingCtrl.create({
      content: 'Redirecting to settings...'
    });
    loading.present();
    const reqObj = {
      "user_id": this.adminGlobals.user_id,
      "device_id": this.adminGlobals.device_id,
      "domain_id": this.domain
    }
    this.dataService.userSetting(reqObj)
    .subscribe((response: any) => {
      loading.dismiss();
      if(response.status == 200 && response.statusText === 'OK' && response.body.status === 'success'){
          this.dataExchangeService.openUrl(response.body.data);
      }
    })
  }
}
