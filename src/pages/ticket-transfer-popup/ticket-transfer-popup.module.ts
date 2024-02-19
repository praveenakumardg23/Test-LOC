import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketTransferPopupPage } from './ticket-transfer-popup';

@NgModule({
  declarations: [
    TicketTransferPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketTransferPopupPage),
  ],
})
export class TicketTransferPopupPageModule {}
