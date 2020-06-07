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
    return this.http.get(this.rootURL + '/hello');
  }

  sendDetectedEvent(detectedEvent: DetectedEvent) {
    const url = `${this.rootURL}/detected-event`;
    const body = detectedEvent;
    return this.http.post(url, body);
  }

}
