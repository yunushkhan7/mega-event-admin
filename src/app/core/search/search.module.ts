import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    MaterialExModule,
    I18nModule
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchModule { }
