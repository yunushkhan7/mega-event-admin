import { ChangePasswordExpireComponent } from './change-password-expire.component';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { MaterialExModule } from 'src/app/shared/material.module';








const routes: Routes = [
  {
    path: '',
    component: ChangePasswordExpireComponent,
    data: { title: 'password-expire' }
  }
];

@NgModule({
  declarations: [
    ChangePasswordExpireComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    SharedModule,
    MaterialExModule,
    I18nModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    AuthService
  ]
})
export class ChangePasswordExpireModule { }
