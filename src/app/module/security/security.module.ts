import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { FooterModule } from 'src/app/core/footer/footer.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SecurityComponent } from './security.component';

const routes: Routes = [
  {
    path: "",
    component: SecurityComponent,
    data: { title: 'Acs server Settings' }
  },
  {
    path: "encryption",
    component: SecurityComponent,
    data: { title: 'Acs server Settings' }
  }
  
]

@NgModule({
  declarations: [
    SecurityComponent   
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
    TranslateModule,
    FooterModule,
    NgxSpinnerModule
  ]
})
export class SecurityModule { }
