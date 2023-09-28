import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  API: string = environment.APIEndpoint;
  
 _selectedTimeSlot = new BehaviorSubject(null);
 _selectedTimeSlotObserv = this._selectedTimeSlot.asObservable();
 constructor(
   private http: HttpClient,
 ) { 
   this._selectedTimeSlot = new BehaviorSubject(null);
   this._selectedTimeSlotObserv = this._selectedTimeSlot.asObservable();
 }

  addTemplate(data): Observable<any> {
    return this.http.post(`${this.API}Schedule/SaveSchedular`, data);
  }

 
}
