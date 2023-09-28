import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  API: string = environment.APIEndpoint + 'PriceSettings/';

  constructor(
    private http: HttpClient,
  ) { }

  getPriceSetting(locationId): Observable<any> {
    return this.http.get(`${this.API}GetPriceSettingsByLocationId?LocationId=${locationId}`);
  }

  getAllPriceSetting(): Observable<any> {
    return this.http.post(`${this.API}GetAllPriceSettings`, {});
  }

  updatePriceSetting(param: any): Observable<any> {
    return this.http.post(`${this.API}UpdatePriceSettings`, param);
  }

  savePriceSetting(param: any): Observable<any> {
    return this.http.post(`${this.API}SavePriceSettings`, param);
  }
}
