import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';

import { SettingsPage } from './../settings/settings';
import { EventsPage } from './../events/events';
import { OrdersPage } from './../orders/orders';
import { SearchPage } from './../search/search';
import { DataExchangeService } from './../services/data-services/data-exchange-service';


export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  disable: boolean;
  hidden: boolean;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage implements OnInit, OnDestroy {
  // Basic root for our content view
  rootPage = 'TabsPage';
  // fullname: string;
  // emailId: string;
  adminGlobals: any;
  pages: PageInterface[];
  llmAppVersion: string;
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataExchangeService: DataExchangeService,
    private storage: Storage,
    private appVersion: AppVersion
    ) {
  }

  ngOnInit() {
    this.appVersion.getVersionNumber().then((version) => {
      this.llmAppVersion = version;
    })

  }
  ionViewDidLoad() {
    this.adminGlobals = this.dataExchangeService.getAdminGlobals();
    this.pages = [
      { title: 'My Events', pageName: 'TabsPage', tabComponent: EventsPage, index: 0, disable: false, hidden: this.adminGlobals.user_type == 'admin' ? false : true },
      { title: 'My Orders', pageName: 'TabsPage', tabComponent: OrdersPage, index: 1, disable: false, hidden: false },
      { title: 'Search Events', pageName: 'TabsPage', tabComponent: SearchPage, index: 2, disable: false, hidden: false },
      { title: 'Settings', pageName: 'TabsPage', tabComponent: SettingsPage, index: 3, disable: false, hidden: false },
      { title: 'Return to Launch Page', pageName: 'TabsPage', disable: false, hidden: false },
      { title: 'Logout', pageName: 'TabsPage', index: 4, disable: false, hidden: false }
    ];
  }

  openPage(page: PageInterface) {
    if (page.title == 'Return to Launch Page') {
      this.storage.clear();
      this.dataExchangeService.setAdminGlobals([]);
      this.dataExchangeService.rootPageName.next('SelectDomainPage');
    } else {
      let params = {};

      // The index is equal to the order of our tabs inside tabs.ts
      if (page.index) {
        params = { tabIndex: page.index };
      }

      // The active child nav is our Tabs Navigation
      if (this.nav.getActiveChildNav() && page.index != undefined) {
        this.nav.getActiveChildNav().select(page.index);
      } else {
        // Tabs are not active, so reset the root page
        // In this case: moving to or from SpecialPage
        this.nav.setRoot(page.pageName, params);
      }
    }
  }

  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }

  ngOnDestroy() {
    this.adminGlobals = {};
  }
}
