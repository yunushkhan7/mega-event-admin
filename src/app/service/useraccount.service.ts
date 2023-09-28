import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UseraccountService {

  API_URL: string = environment.APIEndpoint + 'Users/';

  constructor(
    private http: HttpClient,
  ) { }

  getUserList(param = null): Observable<any> {
    return this.http.post(`${this.API_URL}GetAllUsers`, param);
  }

  saveUserAccount(data): Observable<any> {
    return this.http.post(`${this.API_URL}SaveUser`, data);
  }

  GetUserAccountById(id): Observable<any> {
    return this.http.get(`${this.API_URL}GetUser?id=${id}`);
  }

  UpdateUserAccount(data): Observable<any> {
    return this.http.post(`${this.API_URL}UpdateUser`, data);
  }

  deleteUserAccount(id): Observable<any> {
    return this.http.get(`${this.API_URL}DeleteUser?id=${id}`);
  }

  updateProfilePicture(id, image): Observable<any> {
    return this.http.post(`${this.API_URL}UploadProfilePicture?Guid=${id}&base64String=${image}`, '');
  }
}
