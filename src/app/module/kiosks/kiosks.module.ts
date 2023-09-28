import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KiosksAddComponent } from './kiosks-add/kiosks-add.component';
import { KiosksListComponent } from './kiosks-list/kiosks-list.component';
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

const routes: Routes = [
  {
    path: '',
    component: KiosksListComponent,
    data: { title: 'Kiosk Account list' },
  },
  {
    path: 'add',
    component: KiosksAddComponent,
    data: { title: 'Add Kiosk Account' },
  },
  {
    path: 'edit/:id',
    component: KiosksAddComponent,
    data: { title: 'Update Kiosk Account' },
  },
];

@NgModule({
  declarations: [KiosksAddComponent, KiosksListComponent],
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
export class KiosksModule {}
