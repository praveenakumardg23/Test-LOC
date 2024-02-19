import { DataExchangeService } from './../services/data-services/data-exchange-service';
import { MenuPage } from './../menu/menu';

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, Platform } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';

import { DataService } from './../services/data-services/data-service';
import { AppConfiguration } from './../../app-configuration';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  submitted = false;
  errorMeassgeFlag = false;
  errorMeassge: string;
  domain: string;
  fp_url: string;
  signup_url: string;
  isLocationPermitted: string;
  currentPosition: any;

  @ViewChild('f') formValues: NgForm;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataService: DataService,
    public toastCtrl: ToastController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private dataExchangeService: DataExchangeService,
    public appConfiguration: AppConfiguration,
    public plt: Platform,
    private device: Device) {
      this.storage.get('selectedDomain').then((val) => {
      if(val) {
        this.fp_url = "https://" + val.domain_url + appConfiguration.forgot_password_url;
        this.signup_url = "https://" + val.domain_url + appConfiguration.sign_up_url;
        this.domain = val.id;
      }
    })
  }



  /********* admin user login functionality *******/
  onLogin() {
    this.submitted = true;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.errorMeassgeFlag = false;
    const pwd = btoa(this.formValues.value.password);

    const reqObj = {
      username: this.formValues.value.username,
      password: pwd,
      device_id: this.device.uuid == null ? 'qwertyuiop13349s' : this.device.uuid,
      domain_id: this.domain
    };

    if (this.formValues.valid) {
      loading.present();
      this.dataService.login(reqObj).subscribe(
        (response: any) => {
          localStorage.device_id='';
          loading.dismiss();
          if (response.status == 200 && response.statusText === 'OK' && response.body.status === 'success') {
            this.dataExchangeService.setAdminGlobals(response.body.data);
            this.navCtrl.setRoot(MenuPage);
            this.storage.set('adminGlobals', response.body.data);
          } else {
            let errorDuration;
            if (response.body.message == 'access denied') {
              this.errorMeassge = 'Please contact info@locallevelevents.com to access the App. Thank you!!';
              errorDuration = 10000;
            } else {
              this.errorMeassge = 'Invalid Credentials';
              errorDuration = 5000;
            }
            this.errorMeassgeFlag = true;
            const toast = this.toastCtrl.create({
              message: this.errorMeassge,
              position: 'top',
              duration: errorDuration,
              cssClass: 'toast-login',
              showCloseButton: true,
              closeButtonText: 'x'
            });
            toast.present();
          }
        },
        (error) => {
          loading.dismiss();
          console.log(error);
        }
      );
    }
  }

  /******* scroll screen to show input field when keyboard is opened */
  scrollTo() {
    const scrollArea = this.content.scrollHeight;
    const scrollValue = (scrollArea * 23) / 100;
    this.content.scrollTo(0, scrollValue, 10);
  }

  redirectTo(page) {
    if (page == 'forgotPassword') {
      this.openUrlInBrwoser(this.fp_url);
    } else {
      this.openUrlInBrwoser(this.signup_url);
    }
  }

  openUrlInBrwoser(url) {
    this.dataExchangeService.openUrl(url);
  }
}

