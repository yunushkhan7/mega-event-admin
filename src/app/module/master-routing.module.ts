import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterLayoutComponent } from '../core/layout/sidebar/master-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'user-account',
        loadChildren: () =>
          import('./user-accounts/user-accounts.module').then(
            (m) => m.UserAccountsModule
          ),
      },
      {
        path: 'kiosks',
        loadChildren: () =>
          import('./kiosks/kiosks.module').then((m) => m.KiosksModule),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./location/location.module').then((m) => m.LocationModule),
      },
      {
        path: 'templates',
        loadChildren: () =>
          import('./templates/templates.module').then((m) => m.TemplatesModule),
      },
      {
        path: 'data-retention',
        loadChildren: () =>
          import('./data-retention/data-retention.module').then(
            (m) => m.DataRetentionModule
          ),
      },
      {
        path: 'online-gallery',
        loadChildren: () =>
          import('./online-gallery/online-gallery.module').then(
            (m) => m.OnlineGalleryModule
          ),
      },
      {
        path: 'security',
        loadChildren: () =>
          import('./security/security.module').then(
            (m) => m.SecurityModule
          ),
      },
      {
        path: 'integration',
        loadChildren: () =>
          import('./integration/integration.module').then(
            (m) => m.IntegrationModule
          ),
      },
      {
        path: 'logs',
        loadChildren: () =>
          import('./logs/logs.module').then((m) => m.LogsModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },

      {
        path: 'devices',
        loadChildren: () =>
          import('./devices/devices.module').then((m) => m.DevicesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
