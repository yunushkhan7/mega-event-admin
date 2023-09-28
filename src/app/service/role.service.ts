import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  getRoleList(param): Observable<any> {
    return this.http.post(`${this.API_URL}Role/GetAllRoles`, param);
  }

  getRoleById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetRole`, { params: param });
  }

}
