import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  API_URL = 'http://localhost:8081/workflow';

  constructor(private http: HttpClient) {
  }

  save(data: any): Observable<any> {
    // let storedData: any[] = JSON.parse(localStorage.getItem('flowchart'));
    // if (storedData) {
    //   storedData.push(data);
    // } else {
    //   storedData = [data];
    // }
    // localStorage.setItem('flowchart', JSON.stringify(storedData));
    return this.http.post(this.API_URL + '/save', data);
  }

  getAll(): Observable<any> {
    return this.http.get(this.API_URL + '/getall');
  }
}
