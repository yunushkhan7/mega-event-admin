import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { FooterModule } from 'src/app/core/footer/footer.module';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestPopupComponent } from './test-popup/test-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { SmtpComponent } from './smtp/smtp.component';
import { MegaComponent } from './mega/mega.component';
import {NgxMatIntlTelInputComponent} from 'ngx-mat-intl-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
const routes: Routes = [
  {
    path: "",
    component: SmtpComponent,
    data: { title: 'MOM API' }
  },
  {
    path: "smtp",
    component: SmtpComponent,
    data: { title: 'MOM API' }
  },
  {
    path: 'mega',
    component: MegaComponent,
    data: { title: 'SMS API' }
  }
]

@NgModule({
  declarations: [
    TestPopupComponent,
    SmtpComponent,
    MegaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    PaginationModule,
    FooterModule,
    I18nModule,
    MaterialExModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    SearchModule,
    LoaderModule,
    NgxMatIntlTelInputComponent,
    NgxIntlTelInputModule,
    RouterModule.forChild(routes),
  ]
})
export class IntegrationModule { }
