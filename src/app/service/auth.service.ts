import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  API: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }


  login(data): Observable<any> {
    return this.http.post(`${this.API}Authenticate/AuthenticateUser`, data);
  }

  resend_Otp(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ResendOTP?userGuid=${data}`);
  }

  login_Otp(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/CheckOTP?UserGuid=${data?.UserGuid}&otp=${data?.otp}`);
  }
  
  forgot_Otp(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/CheckOTPForgotpassword?UserGuid=${data?.UserGuid}&EmailId=${data.EmailId}&otp=${data?.otp}`);
  }

  ForgotPasswordOTP(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ForgotPasswordOTP?UserName=${data?.UserName}&EmailId=${data?.EmailId}`);
  }

  changePassword(data, slug): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ChangePassword`, {
      params: data,
      headers: new HttpHeaders({
        Authorization: `Bearer ${slug}`
      })
    });
  }

  updatePassword(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ChangePassword?oldPassword=${data?.oldPassword}&newPassword=${data?.newPassword}`);
  }

  CreateNewPassword(data):Observable<any>{
    return this.http.get(`${this.API}Authenticate/UpdatePassword?UserGuid=${data?.UserGuid}&Password=${data?.newPassword}`);
  }

}
