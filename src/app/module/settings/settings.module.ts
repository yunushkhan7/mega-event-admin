import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceSettingComponent } from './price-setting/price-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

const routes: Routes = [
  {
    path: "",
    component: PriceSettingComponent,
    data: { title: 'Price Setting' }
  },
  {
    path: "price-settings",
    component: PriceSettingComponent,
    data: { title: 'Price Setting' }
  }
]

@NgModule({
  declarations: [
    PriceSettingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    LoaderModule,
    I18nModule
  ]
})
export class SettingsModule { }
