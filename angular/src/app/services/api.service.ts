import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  getHello() {
    return this.http.get(this.rootURL + '/hello');
  }

}
