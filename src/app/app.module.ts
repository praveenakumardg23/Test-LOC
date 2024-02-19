import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { QRScanner } from '@ionic-native/qr-scanner';
// import { CameraPreview } from '@ionic-native/camera-preview';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SwingModule } from 'angular2-swing';
import { SocialSharing } from '@ionic-native/social-sharing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Geolocation } from '@ionic-native/geolocation';

import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AppVersion } from '@ionic-native/app-version';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { AppConfiguration } from './../app-configuration';
import { MenuPage } from './../pages/menu/menu';
import { EventsPage } from './../pages/events/events';
import { OrdersPage } from './../pages/orders/orders';
import { SearchPage } from './../pages/search/search';
import { SettingsPage } from './../pages/settings/settings';
import { SelectDomainPage } from './../pages/select-domain/select-domain';
import { DataService } from '../pages/services/data-services/data-service';
import { NetworkService } from '../pages/services/network-services/network-service';
import { OfflineManagerService } from '../pages/services/network-services/offline-manager-service';
import { DataExchangeService } from './../pages/services/data-services/data-exchange-service';
import { ApiService } from '../services/api-services/api-service';
import { DeviceValidationPopupPage } from './../pages/device-validation-popup/device-validation-popup';
import { SearchTicketPage } from './../pages/search-ticket/search-ticket';
import { AppHammerConfig } from './../app-hammerjs-configuration';
import { EventsdatePopoverPage } from './../pages/eventsdate-popover/eventsdate-popover';
import { ManualscanValidationPopupPage } from './../pages/manualscan-validation-popup/manualscan-validation-popup';
import { TicketscanPopoverPage } from './../pages/ticketscan-popover/ticketscan-popover';
import { TicketscanValidationPopupPage } from './../pages/ticketscan-validation-popup/ticketscan-validation-popup';
import { QrcodeScanPage } from './../pages/qrcode-scan/qrcode-scan';
import { OrderDetailPage } from './../pages/order-detail/order-detail';
import { EventVenuePopoverPage } from './../pages/event-venue-popover/event-venue-popover';
import { ShareTicketPopupPage } from './../pages/share-ticket-popup/share-ticket-popup';
import { TicketValidateTransferViewPage } from './../pages/ticket-validate-transfer-view/ticket-validate-transfer-view';
import { TicketValidationPopupPage } from '../pages/ticket-validation-popup/ticket-validation-popup';
import { TicketTransferPopupPage } from '../pages/ticket-transfer-popup/ticket-transfer-popup';
import { NativeAudio } from '@ionic-native/native-audio';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MenuPage,
    EventsPage,
    OrdersPage,
    SearchPage,
    SettingsPage,
    SelectDomainPage,
    DeviceValidationPopupPage,
    TicketscanValidationPopupPage,
    QrcodeScanPage,
    TicketscanPopoverPage,
    SearchTicketPage,
    ManualscanValidationPopupPage,
    EventsdatePopoverPage,
    OrderDetailPage,
    EventVenuePopoverPage,
    ShareTicketPopupPage,
    TicketValidateTransferViewPage,
    TicketValidationPopupPage,
    TicketTransferPopupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    SwingModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MenuPage,
    EventsPage,
    OrdersPage,
    SearchPage,
    SettingsPage,
    SelectDomainPage,
    DeviceValidationPopupPage,
    TicketscanValidationPopupPage,
    QrcodeScanPage,
    TicketscanPopoverPage,
    SearchTicketPage,
    ManualscanValidationPopupPage,
    EventsdatePopoverPage,
    OrderDetailPage,
    EventVenuePopoverPage,
    ShareTicketPopupPage,
    TicketValidateTransferViewPage,
    TicketValidationPopupPage,
    TicketTransferPopupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Keyboard,
    DataService,
    NetworkService,
    OfflineManagerService,
    ApiService,
    DataExchangeService,
    AppConfiguration,
    Device,
    QRScanner,
    NativeAudio,
    // CameraPreview,
    InAppBrowser,
    { provide: HAMMER_GESTURE_CONFIG, useClass: AppHammerConfig },
    LaunchNavigator,
    SocialSharing,
    ScreenOrientation,
    Geolocation,
    OpenNativeSettings,
    AppVersion,
    SafariViewController,
    Network
  ]
})
export class AppModule { }
