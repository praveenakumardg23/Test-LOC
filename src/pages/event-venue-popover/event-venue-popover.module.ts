import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventVenuePopoverPage } from './event-venue-popover';

@NgModule({
  declarations: [
    EventVenuePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(EventVenuePopoverPage),
  ],
})
export class EventVenuePopoverPageModule {}
