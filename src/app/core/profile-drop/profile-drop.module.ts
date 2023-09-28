import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDropComponent } from './profile-drop.component';
import { RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [ProfileDropComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialExModule,
    I18nModule
  ],
  exports: [
    ProfileDropComponent
  ]
})
export class ProfileDropModule { }
