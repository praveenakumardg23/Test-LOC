import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketValidateTransferViewPage } from './ticket-validate-transfer-view';

@NgModule({
  declarations: [
    TicketValidateTransferViewPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketValidateTransferViewPage),
  ],
})
export class TicketValidateTransferViewPageModule {}
