import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareTicketPopupPage } from './share-ticket-popup';

@NgModule({
  declarations: [
    ShareTicketPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareTicketPopupPage),
  ],
})
export class ShareTicketPopupPageModule {}
