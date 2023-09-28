import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LoginRedirect implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    if (sessionStorage.getItem('_auth_webcheckinA')) {
      return false;
    } else {
      return true;
    }
  }
}
