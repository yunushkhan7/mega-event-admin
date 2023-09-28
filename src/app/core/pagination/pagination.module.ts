import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    MaterialExModule,
    FormsModule,
    I18nModule
  ], exports: [PaginationComponent]
})
export class PaginationModule { }
