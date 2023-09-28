import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { decryptValue } from '../shared/common';
import { JwtService } from './jwt.service';
import { fromEvent, Subject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isShort: boolean;
  API_URL: string = environment.APIEndpoint;
  API_URL2: string = environment.APIEndpoint + 'api/';
  constructor(
    private http: HttpClient,
    private jwt: JwtService
  ) {}

  fileUpload(file) {
    return this.http.post(`${this.API_URL}FileUpload/Upload`, file).toPromise();
  }

  GetCurrentUserProfileAPI(): Observable<any> {
    return this.http.get(`${this.API_URL}Authenticate/CurrentUserProfile`);
  }

  ReAuthenticate(data): Observable<any> {
    return this.http.post(`${this.API_URL}Authenticate/RewebAuthenticate`, data);
  }
  ReAuthenticate2(data): Observable<any> {
    return this.http.post(`${this.API_URL2}Client/ReAuthenticate`, data);
  }
  refreshToken(): Observable<any> {
    return this.http.post(`${this.API_URL}v1/Authentication/RefreshToken`, { 'refreshToken': decryptValue(this.jwt.getRefreshToken()) }, { withCredentials: true });
  }

  logout(token): Observable<any> {
    return this.http.post(`${this.API_URL}v1/Authentication/RevokeToken`, { 'refreshToken': token });
  }

  sortData(filedName: any = '', ArrayList: any = []) {
    const data = ArrayList.slice();
    ArrayList = data.sort((a, b) => {
      return (a[filedName] < b[filedName] ? -1 : 1) * (this.isShort ? 1 : -1);
    });
    return ArrayList;
  }

  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
      return { invalidName: true };
    }
  }
}
