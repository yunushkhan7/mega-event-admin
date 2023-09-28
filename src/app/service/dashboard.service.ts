import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  API_URL: string = environment.APIEndpoint + 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  saveDoor(data): Observable<any> {
    return this.http.post(`${this.API_URL}Doors/SaveDoors`, data);
  }

  // DsahboardTodayRegisterCount

  getDsahboardMonthlyWise(month): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/DsahboardMonthlyWise?Name=${month}`);
  }

  getDsahboardRegisterCount(): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/DsahboardTodayRegisterCount`);
  }

  getDsahboardTodayRegisterCount(): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/DsahboardTodayRegisterCount`);
  }

  getTimeBasedTodayRegistration(): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/GetTimeBasedTodayRegistration`);
  }

  getOnSitePersonal(): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/GetOnSitePersonal`);
  }





  GetDoorById(id): Observable<any> {
    return this.http.get(`${this.API_URL}Doors/GetDoorsById?id=${id}`);
  }

  deleteDoor(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Doors/DeleteDoor?id=${id}`);
  }

}
