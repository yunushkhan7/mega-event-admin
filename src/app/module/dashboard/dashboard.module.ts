import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { NgChartsModule } from 'ng2-charts';
import { FooterModule } from 'src/app/core/footer/footer.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DoughnutComponent } from './doughnut/doughnut.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  }
]

@NgModule({
  declarations: [DashboardComponent, DoughnutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialExModule,
    I18nModule,
    NgChartsModule,
    FooterModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      animationDuration: 300,
    })
  ]
})
export class DashboardModule { }
