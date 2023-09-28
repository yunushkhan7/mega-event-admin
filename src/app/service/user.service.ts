import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API: string = environment.APIEndpoint + 'Users/';
  APIS: string = environment.APIEndpoint + 'Venue/';
  constructor(
    private http: HttpClient,
  ) { }

  getUserList(param = null): Observable<any> {
    return this.http.post(`${this.API}GetAllUsers`, param);
  }

  saveUser(data): Observable<any> {
    return this.http.post(`${this.API}SaveUser`, data);
  }

  getUserById(param): Observable<any> {
    return this.http.get(`${this.API}GetUser`, { params: param });
  }

  UpdateUser(data): Observable<any> {
    return this.http.post(`${this.API}Users/UpdateUser`, data);
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(`${this.API}DeleteUser?id=${id}`);
  }

  fileUpload(data, param): Observable<any> {
    return this.http.post(`${this.API}BulkUpload`, data, { params: param });
  }

  updatePassword(data): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}Authenticate/ChangePassword`, data);
  }

  changePassword(data, slug): Observable<any> {
    return this.http.get(`${this.API}Authentication/UpdatePasswordnewPassword=${data?.newPassword}`, {
      params: data,
      headers: new HttpHeaders({
        Authorization: `Bearer ${slug}`
      })
    });
  }

  passwordChange(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/UpdatePassword?UserGuid=${data?.UserGuid}&newPassword=${encodeURIComponent(data?.newPassword)}`);
  }

  getMasterData(): Observable<any> {
    return this.http.get(`${this.API}/user/master-data`);
  }

  checkLoginIdExists(param = null): Observable<any> {
    return this.http.get(`${this.API}CheckLoginIdExists`, { params: param });
  }

  // user adudit
  getUserAudit(data): Observable<any> {
    return this.http.post(`${this.API}SystemLogs/GetAllUserAudit`, data);
  }

  // SystemLogs
  getSystemLogs(data): Observable<any> {
    return this.http.post(`${this.API}SystemLogs/GetAllSystemLogs`, data);
  }

  saveProfileImage(payload): Observable<any> {
    return this.http.post(`${this.API}UploadProfilePicture`, payload);
  }

  getVenueList(param): Observable<any> {
    return this.http.post(`${this.APIS}GetAllVenues`, param);
  }

  saveVenue(data): Observable<any> {
    return this.http.post(`${this.APIS}SaveVenue`, data);
  }

  getVenueById(id: number): Observable<any> {
    return this.http.get(`${this.APIS}GetVenue?id=${id}`);
  }

  deleteVenue(id: number): Observable<any> {
    return this.http.get(`${this.APIS}DeleteVenue?id=${id}`);
  }

  updateVenue(data): Observable<any> {
    return this.http.post(`${this.APIS}UpdateVenue`, data);
  }

  deleteProfileImage(userguid): Observable<any> {
    return this.http.get(`${this.API}DeleteProfilePic?userguid=${userguid}`);
  }
}
