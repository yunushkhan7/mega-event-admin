import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  API: string = environment.APIEndpoint + 'Schedule/';

  constructor(
    private http: HttpClient,
  ) { }

  getAllSchedule(param): Observable<any> {
    return this.http.post(`${this.API}GetAllSchedule`, param);
  }

  deleteSchedule(id): Observable<any> {
    return this.http.get(`${this.API}DeleteSchedule?ScheduleId=${id}`);
  }
  deleteScheduleDetails(id): Observable<any> {
    return this.http.delete(`${this.API}DeleteScheduleDetails?Id=${id}`);
  }
  editSchedule(id): Observable<any> {
    return this.http.get(`${this.API}GetScheduleById?id=${id}`);
  }

  saveSchedule(data): Observable<any> {
    return this.http.post(`${this.API}SaveSchedular`, data);
  }
}
