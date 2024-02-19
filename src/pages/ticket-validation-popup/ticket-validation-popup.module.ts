import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketValidationPopupPage } from './ticket-validation-popup';

@NgModule({
  declarations: [
    TicketValidationPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketValidationPopupPage),
  ],
})
export class TicketValidationPopupPageModule {}
