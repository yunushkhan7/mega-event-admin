import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { MaterialExModule } from 'src/app/shared/material.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { FooterModule } from 'src/app/core/footer/footer.module';
import {NgxMatIntlTelInputComponent} from 'ngx-mat-intl-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: { title: 'Profile' }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { title: 'Change Password' }
  },
  {
    path: 'edit',
    component: EditProfileComponent,
    data: { title: 'Update Profile' }
  }
]

@NgModule({
  declarations: [ProfileComponent, ChangePasswordComponent, EditProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormValidationModule,
    SharedModule,
    RouterModule.forChild(routes),
    MaterialExModule,
    MatInputModule,
    MatButtonModule,
    LoaderModule,
    I18nModule,
    FooterModule,
    NgxMatIntlTelInputComponent,
    NgxIntlTelInputModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
  ], providers: [
    AuthService
  ]
})
export class ProfileModule { }
