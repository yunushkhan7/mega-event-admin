import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  API: string = environment.APIEndpoint + 'ActivityLogs/';
  constructor(
    private http: HttpClient,
  ) { }

  getAllLogs(data, filterData, sort): Observable<any> { 
    return this.http.get(`${this.API}GetAllActivityLogs?pageNo=${data?.pageNo}&limit=${data?.limit}&filter=${JSON.stringify(filterData)}&sort=${JSON.stringify(sort)}`);
  }

  downloadAllLogs(data, filterData,sort): Observable<any> {
    return this.http.get(`${this.API}DownloadActivityLogs?filter=${JSON.stringify(filterData)}&sort=${JSON.stringify(sort)}`);
  }
}
