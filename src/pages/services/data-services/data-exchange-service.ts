import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { Subject } from 'rxjs';

@Injectable()
export class DataExchangeService {
  tickets = [];
  adminGlobalsArray = [];
  rootPageName = new Subject();

  constructor(
    private iab: InAppBrowser,
    public plt: Platform,
    private safariViewController: SafariViewController
  ) { }

  setAdminGlobals(data) {
    this.adminGlobalsArray = data;
  }

  getAdminGlobals() {
    return this.adminGlobalsArray;
  }

  removeAdminGlobals() {
    this.adminGlobalsArray = null;
  }

  setEventTickets(data) {
    this.tickets = data;
  }

  getEventTickets() {
    return this.tickets;
  }

  removeEventTickets() {
    this.tickets = null;
  }

  openUrl(url) {
    if (this.plt.is('android')) {
      this.openUrlInAppBrowser(url);
    } else if (this.plt.is('ios')) {
      this.safariViewController.isAvailable()
        .then((available: boolean) => {
          if (available) {
            this.safariViewController.show({
              url: url,
              hidden: false,
              animated: false,
              tintColor: "#ffffff",
              barColor: "#eba821",
              controlTintColor: "#ffffff"
            })
              .subscribe((result: any) => {
                if (result.event === 'opened') { }
                else if (result.event === 'loaded') { }
                else if (result.event === 'closed') { }
              },
                (error: any) => console.error(error)
              );
          } else {
            this.openUrlInAppBrowser(url);
          }
        })
    }
  }

  openUrlInAppBrowser(url) {
    const options: InAppBrowserOptions = {
      closebuttoncolor: 'white',
      toolbarcolor: '#eba821',
      navigationbuttoncolor: 'white',
      footer: 'yes',
      footercolor: '#eba821',
      clearcache: 'yes',
      clearsessioncache: 'yes'
    }
    let target = "_blank";
    this.iab.create(url, target, options);
  }
}
