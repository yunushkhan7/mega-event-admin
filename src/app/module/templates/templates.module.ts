import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySchedulesListComponent } from './daily-schedules/daily-schedules-list/daily-schedules-list.component';
import { DailySchedulesAddComponent } from './daily-schedules/daily-schedules-add/daily-schedules-add.component';
import { Routes, RouterModule } from '@angular/router';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterModule } from 'src/app/core/footer/footer.module';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { TandcListComponent } from './t-and-c/tandc-list/tandc-list.component';
import { TandcAddComponent } from './t-and-c/tandc-add/tandc-add.component';

const routes: Routes = [
  {
    path: '',
    component: DailySchedulesListComponent,
    data: { title: 'User Account list' },
  },
  {
    path: 'daily-schedules',
    component: DailySchedulesListComponent,
    data: { title: 'User Account list' },
  },
  {
    path: 'add',
    component: DailySchedulesAddComponent,
    data: { title: 'Add User Account' },
  },
  {
    path: 'edit/:id',
    component: DailySchedulesAddComponent,
    data: { title: 'Add User Account' },
  },
  {
    path: 'terms',
    component: TandcListComponent,
    data: { title: 'T&C' },
  },
  {
    path: 'terms/add',
    component: TandcAddComponent,
    data: { title: 'T&C' },
  },
];

@NgModule({
  declarations: [
    DailySchedulesListComponent,
    DailySchedulesAddComponent,
    TandcListComponent,
    TandcAddComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    PaginationModule,
    SearchModule,
    LoaderModule,
    I18nModule,
    FooterModule,
    NgxMatIntlTelInputComponent,
    NgxIntlTelInputModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
  ],
})
export class TemplatesModule {}
