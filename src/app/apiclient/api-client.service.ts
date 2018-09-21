import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  REAL_API_URL = 'https://workflow-ui.herokuapp.com/workflows';
  // REAL_API_URL = 'http://172.16.52.83:8085/api/workflows';

  constructor(private http: HttpClient) {
  }


  getStepTypes(): Observable<any> {
    return this.http.get(this.REAL_API_URL + '/GetStepTypes');
  }

  getParamaters(): Observable<any> {
    return this.http.get(this.REAL_API_URL + '/DataContextAttributes');
  }


  save(data: any): Observable<any> {
    return this.http.post(this.REAL_API_URL + '/save', data);
  }

  getAll(): Observable<any> {
    return this.http.get(this.REAL_API_URL + '/getall');
  }

  run(data: any): Observable<any> {
    return this.http.post(this.REAL_API_URL + '/', data);
  }
}
