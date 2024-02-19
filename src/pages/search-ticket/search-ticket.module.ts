import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchTicketPage } from './search-ticket';

@NgModule({
  declarations: [
    SearchTicketPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchTicketPage),
  ],
})
export class SearchTicketPageModule {}
