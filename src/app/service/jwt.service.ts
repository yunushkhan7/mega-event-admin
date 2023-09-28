import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public idle$: Subject<boolean> = new Subject();
  public wake$: Subject<boolean> = new Subject();
  isIdle = false;
  private idleAfterSeconds = 600;
  private countDown;
  
  constructor(
    private http: HttpClient,
  ) {
          // Setup events
  fromEvent(document, 'mousemove').subscribe(() => this.onInteraction("mousemove"));
  fromEvent(document, 'touchstart').subscribe(() => this.onInteraction("touchstart"));
  fromEvent(document, 'keydown').subscribe(() => this.onInteraction("keydown"));
   }
  
  getToken(): string {
    return window.sessionStorage['_auth_webcheckinA'];
  }

  saveToken(token: string) {
    window.sessionStorage['_auth_webcheckinA'] = token;
  }

  destroyToken() {
    window.sessionStorage.removeItem('_auth_webcheckinA');
  }

  getCompanyId(): string {
    return window.sessionStorage['__webcheckinA__cmp'];
  }

  saveCompanyId(id: any) {
    window.sessionStorage['__webcheckinA__cmp'] = id;
  }

  destroyCompanyId() {
    window.sessionStorage.removeItem('__webcheckinA__cmp');
  }

  getCompanyName(): string {
    return window.sessionStorage['__webcheckinA__cmp_nm'];
  }

  saveCompanyName(name: any) {
    window.sessionStorage['__webcheckinA__cmp_nm'] = name;
  }

  destroyCompanyName() {
    window.sessionStorage.removeItem('__webcheckinA__cmp_nm');
  }

  saveValue(name, value) {
    window.sessionStorage[name] = value;
  }

  destroyValue(name) {
    window.sessionStorage.removeItem(name);
  }

  getValue(name): string {
    return window.sessionStorage[name]; // window.sessionStorage['google_token'];
  }

  // refreshToken
  getRefreshToken(): string {
    return window.sessionStorage['refreshToken'];
  }

  reauthenticate(payload): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}Authenticate/ReAuthenticate`, payload);
  }

  saveRefreshToken(token: string) {
    window.sessionStorage['refreshToken'] = token;
  }

  destroyRefreshToken() {
    window.sessionStorage.removeItem('refreshToken');
  }



  onInteraction(a) {
    // Is idle and interacting, emit Wake
    if (this.isIdle) {
      this.isIdle = false;
      this.wake$.next(true);
    }
  
    // User interaction, reset start-idle-timer
    clearTimeout(this.countDown);
    this.countDown = setTimeout(() => {
      // Countdown done without interaction - emit Idle
      this.isIdle = true;
      this.idle$.next(true);
    }, this.idleAfterSeconds * 1000) 
  }
}
