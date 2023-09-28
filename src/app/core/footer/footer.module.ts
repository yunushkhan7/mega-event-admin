import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';


@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    MaterialExModule,
    I18nModule
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule { }
