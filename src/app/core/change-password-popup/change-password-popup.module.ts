import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { MaterialExModule } from 'src/app/shared/material.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { ChangePasswordComponentPopup } from './change-password-popup.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [ChangePasswordComponentPopup],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormValidationModule,
    SharedModule,
    MaterialExModule,
    MatInputModule,
    MatButtonModule,
    LoaderModule,
    I18nModule
  ], providers: [AuthService],
  exports: [ChangePasswordComponentPopup]
})
export class ChangePasswordModule { }
