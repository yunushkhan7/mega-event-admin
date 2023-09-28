import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  API_URL: string = environment.APIEndpoint + 'Ethernet/';
  API_URL2: string = environment.APIEndpoint + 'QrReader/';
  API_URL3: string = environment.APIEndpoint + 'Door/';
  constructor(
    private http: HttpClient,
  ) { }


  // Ethernet
  getAllEthernetList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetAllEthernet`, param);
  }

  saveEthernet(data): Observable<any> {
    return this.http.post(`${this.API_URL}InsertEthernet`, data);
  }

  getEthernetById(id): Observable<any> {
    return this.http.get(`${this.API_URL}GetEthernetById?id=${id}`);
  }

  updateEthernet(data): Observable<any> {
    return this.http.post(`${this.API_URL}UpdateEthernet`, data);
  }

  deleteEthernetById(id): Observable<any> {
    return this.http.get(`${this.API_URL}DeleteEthernet?id=${id}`);
  }


  // QrReader


  GetAllQrReaderList(param): Observable<any> {
    return this.http.post(`${this.API_URL2}GetAllQrReader`, param);
  }

  saveQrReader(data): Observable<any> {
    return this.http.post(`${this.API_URL2}InsertQrReader`, data);
  }

  getQrReaderById(id): Observable<any> {
    return this.http.get(`${this.API_URL2}GetQrReaderById?id=${id}`);
  }

  updateQrReader(data): Observable<any> {
    return this.http.post(`${this.API_URL2}UpdateQrReader`, data);
  }

  deleteQrReader(id): Observable<any> {
    return this.http.get(`${this.API_URL2}DeleteQrReader?id=${id}`);
  }



   // Door


   GetAllDoorList(param): Observable<any> {
    return this.http.post(`${this.API_URL3}GetAllDoor`, param);
  }

  saveDoor(data): Observable<any> {
    return this.http.post(`${this.API_URL3}InsertDoor`, data);
  }

  getDoorById(id): Observable<any> {
    return this.http.get(`${this.API_URL3}GetDoorById?id=${id}`);
  }

  UpdateDoor(data): Observable<any> {
    return this.http.post(`${this.API_URL3}UpdateDoor`, data);
  }

  deleteDoorById(id): Observable<any> {
    return this.http.get(`${this.API_URL3}DeleteDoor?id=${id}`);
  }

  unLockDoor(id): Observable<any> {
    return this.http.get(`${this.API_URL3}UnlockDoor?id=${id}`);
  }

  testQrReader(testQrData): Observable<any> {
    return this.http.get(`${this.API_URL2}TestQrReaderDeviceConnection${testQrData}`);
  }

  testEthernetReader(testQrData): Observable<any> {
      return this.http.get(`${this.API_URL}TestEthernetConnection${testQrData}`);
    }

}
