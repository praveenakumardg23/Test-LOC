import { SelectDomainPage } from './../pages/select-domain/select-domain';
import { DataExchangeService } from './../pages/services/data-services/data-exchange-service';
import { MenuPage } from './../pages/menu/menu';
import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { NetworkService, ConnectionStatus } from '../pages/services/network-services/network-service';
import { OfflineManagerService } from '../pages/services/network-services/offline-manager-service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private keyboard: Keyboard,
    private storage: Storage,
    private dataExchangeService: DataExchangeService,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // watch network for a disconnection
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status == ConnectionStatus.Online) {
          this.offlineManager.checkForEvents().subscribe();
        }
      });

    });
    this.storage.length().then((val) => {
      if (val == 0) {
        this.rootPage = SelectDomainPage;
      } else {
        this.storage.get('isDomainSelected').then((val) => {
          if (val) {
            this.redirectTo();
          } else {
            this.rootPage = SelectDomainPage;
          }
        })
      }
    })

    // this.storage.forEach((value, key, index) => {
    //   console.log(key);
    //   console.log(value);
    //   if (key == 'isDomainSelected' && !value) {
    //     this.rootPage = SelectDomainPage;
    //   } else if (key == 'isDomainSelected' && value) {
    //     this.rootPage = LoginPage;
    //   } else if (key == 'adminGlobals') {
    //     this.dataExchangeService.setAdminGlobals(value);
    //     if (value === null || !value) {
    //       this.rootPage = LoginPage;
    //     } else {
    //       this.rootPage = MenuPage;
    //     }
    //   }
    // })

    // this.storage.get('adminGlobals').then((val) => {
    // this.dataExchangeService.setAdminGlobals(val);
    //   if (val === null || !val) {
    //     this.rootPage = LoginPage;
    //   }else{
    //     this.rootPage = MenuPage;
    //   }
    // })
  }

  ngOnInit() {
    this.keyboard.hideFormAccessoryBar(false);
    this.dataExchangeService.rootPageName.subscribe(
      (rootpage) => {
        console.log(rootpage);
        if (rootpage == 'LoginPage') {
          this.rootPage = LoginPage;
        } else if (rootpage == 'SelectDomainPage') {
          this.rootPage = SelectDomainPage;
        }
      }
    );
  }

  redirectTo() {
    this.storage.get('adminGlobals').then((val) => {
      this.dataExchangeService.setAdminGlobals(val);
      if (val === null || !val) {
        this.rootPage = LoginPage;
      } else {
        this.rootPage = MenuPage;
      }
    })
  }
}

