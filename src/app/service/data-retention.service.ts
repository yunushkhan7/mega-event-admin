import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataRetentionService {

  API: string = environment.APIEndpoint + 'DataRetention/';
  constructor(
    private http: HttpClient,
  ) { }

  getDataRetention(): Observable<any> {
    return this.http.get(`${this.API}GetDataRetention`);
  }

  saveDataRetention(data): Observable<any> {
    return this.http.post(`${this.API}SaveDataRetention`, data);
  }

  updateDataRetention(data): Observable<any> {
    return this.http.post(`${this.API}UpdateDataRetention`, data);
  }
}
