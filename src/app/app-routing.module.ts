import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRedirect, EnsureAuthenticated } from './service/_guards';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule),
    canActivate: [LoginRedirect],
    data: { title: 'Login' },
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canActivate: [LoginRedirect],
    data: { title: 'forgot-password' },
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
    canActivate: [LoginRedirect],
    data: { title: 'reset-password' },
  },
  {
    path: 'verification',
    loadChildren: () => import('./auth/verify-opt/verify-opt.module').then(m => m.VerifyOptModule),
    canActivate: [LoginRedirect],
    data: { title: 'link-expired' },
  },
  {
    path: 'login-otp',
    loadChildren: () => import('./auth/login-otp/login-otp.module').then(m => m.LoginOtpModule),
    canActivate: [LoginRedirect],
    data: { title: 'login-opt' },
  },

  {
    path: 'password-expire',
    loadChildren: () =>
      import('./module//change-password-expire/change-password-expire.module').then((m) => m.ChangePasswordExpireModule),
    canActivate: [LoginRedirect],
    data: { title: 'password-expire' },
  },
  {
    path: '',
    loadChildren: () => import('./module/master.module').then(m => m.MasterModule),
    canActivate: [EnsureAuthenticated],
  },
  {
    path: '404',
    loadChildren: () => import('./module/not-found/not-found.module').then((m) => m.NotfoundModule),
  },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
