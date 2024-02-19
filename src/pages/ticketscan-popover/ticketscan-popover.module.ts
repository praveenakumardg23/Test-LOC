import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketscanPopoverPage } from './ticketscan-popover';

@NgModule({
  declarations: [
    TicketscanPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketscanPopoverPage),
  ],
})
export class TicketscanPopoverPageModule {}
