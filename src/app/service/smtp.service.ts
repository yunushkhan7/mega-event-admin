import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmtpService {

  API: string = environment.APIEndpoint + 'Settings/';
  API2: string = environment.APIEndpoint + 'v1/TestEmail/';
  kioskAPI: string = environment.APIEndpoint + 'Kiosk/';
  reportAPI: string = environment.APIEndpoint + 'PhotoKiosk/';
  accessAPI: string = environment.APIEndpoint + 'AccessLog/';

  myHeaders: any;
  constructor(
    private http: HttpClient,
  ) { }

  getAllSmtp(): Observable<any> {
    return this.http.get(`${this.API}GetSmtpConfig`);
  }

  updateSmpt(data): Observable<any> {
    return this.http.post(`${this.API}UpdateSmtpConfig`, data);
  }

  SendTestMail(email): Observable<any> {
    return this.http.get(`${this.API2}EmailConnnection?emailId=${email}`);
  }

  saveKiosk(params: any): Observable<any> {
    return this.http.post(`${this.kioskAPI}SaveKiosk`, params);
  }

  getKioskById(id: number): Observable<any> {
    return this.http.get(`${this.kioskAPI}GetKioskById?id=${id}`);
  }

  getKioskList(params): Observable<any> {
    return this.http.post(`${this.kioskAPI}GetAllKiosk`, params);
  }

  deleteKiosk(id: number): Observable<any> {
    return this.http.get(`${this.kioskAPI}DeleteKiosk?id=${id}`);
  }

  getallPhotoReports(param): Observable<any> {
    return this.http.post(`${this.reportAPI}GetAllPhotoReports`, param);
  }

  getallAccessReports(param): Observable<any> {
    return this.http.post(`${this.accessAPI}GetAllAccessLogs`, param);
  }

  getAccessLogDownloadExcel(params:any): Observable<any> {
    return this.http.post(`${this.accessAPI}DowloadAccessLogExcel`, params);
  }

  getDownloadExcel(params:any): Observable<any> {
    return this.http.post(`${this.reportAPI}DowloadPhotoReportsExcel`, params);
  }

  getPhotoKiosk(resendData): Observable<any> {
    return this.http.get(`${this.reportAPI}ResendPhotoMail${resendData}`);
  }

  getOnlineGalleryReport(param): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}OnlineGalleryReport/GetAllOnlineGalleryReport`, param);
  }
  downloadOnlineGalleryReportExcel(params:any): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}DowloadOnlineGalleryReportsExcel`, params);
  }

}
