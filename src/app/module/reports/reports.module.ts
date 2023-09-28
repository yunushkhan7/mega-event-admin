import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { FooterModule } from 'src/app/core/footer/footer.module';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from 'src/app/core/search/search.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
import { TicketValidationComponent } from './ticket-validation/ticket-validation.component';
import { IssuedTicketsComponent } from './issued-tickets/issued-tickets.component';
import { PhotoReportComponent } from './photo-report/photo-report.component';
import { WristbandComponent } from './wristbanbd/wristband.component';
import { ReportOnlineGalleryComponent } from './report-online-gallery/report-online-gallery.component';

const routes: Routes = [
  {
    path: "",
    component: TicketValidationComponent,
    data: { title: 'TicketValidation' }
  },
  {
    path: 'Ticket-Validation',
    component: TicketValidationComponent,
    data: { title: 'TicketValidation' }
  },
  {
    path: 'Issued-Tickets',
    component: IssuedTicketsComponent,
    data: { title: 'IssuedTickets' }
  },
  {
    path: 'photo-report',
    component: PhotoReportComponent,
    data: { title: 'Photo Entry' }
  },
  {
    path: 'wristband-validation',
    component: WristbandComponent,
    data: { title: 'Wristband validation' }
  },
  {
    path: 'online-gallery',
    component: ReportOnlineGalleryComponent,
    data: { title: 'Report online gallery' }
  }
];
@NgModule({
  declarations: [
    TicketValidationComponent,
    IssuedTicketsComponent,
    PhotoReportComponent,
    WristbandComponent,
    ReportOnlineGalleryComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialExModule,
    I18nModule,
    FooterModule,
    PaginationModule,
    FormValidationModule,
    FormsModule,
    ReactiveFormsModule,
    SearchModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    SharedModule
  ],
  exports: [RouterModule],
})
export class ReportsModule {}
