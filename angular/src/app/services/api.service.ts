import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DetectedEvent} from "../components/detected-event/detected-event";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  getHello() {
    console.log('getHello');
    return this.http.get(this.rootURL + '/api/hello');
  }

  clientAvailable() {
    const url = `${this.rootURL}/client/available`;
    const body = {};
    return this.http.put(url, body);
  }

  clientsAvailable() {
    const url = `${this.rootURL}/clients`;
    return this.http.get(url);
  }

  clientDisabled() {
    const url = `${this.rootURL}/client/disabled`;
    const body = { };
    return this.http.put(url, body);
  }

  sendDetectedEvent(detectedEvent: DetectedEvent) {
    const url = `${this.rootURL}/detected-event`;
    const body = detectedEvent;
    return this.http.post(url, body);
  }

  destroyAllDetectedEvents() {
    const url = `${this.rootURL}/detected-event/all`;
    return this.http.delete(url);
  }

}
