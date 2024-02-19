import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectDomainPage } from './select-domain';

@NgModule({
  declarations: [
    SelectDomainPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectDomainPage),
  ],
})
export class SelectDomainPageModule {}
