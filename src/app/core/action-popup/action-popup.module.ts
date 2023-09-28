import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPopupComponent } from './action-popup.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [
    ActionPopupComponent
  ],
  imports: [
    CommonModule,
    I18nModule
  ],
  exports: [ActionPopupComponent]
})
export class ActionPopupModule { }
