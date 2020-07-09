import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DetectedEvent} from "../components/detected-event/detected-event";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  ping() {
    return this.http.get(this.rootURL + '/ping');
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

  sendVolumeThreshold(volume:number, clientId:string) {
    const url = `${this.rootURL}/client/threshold`;
    const body = { threshold: volume, clientId: clientId };
    return this.http.put(url, body);
  }

  clientPostBabyInformation(name: string, gender: string) {
    const url = `${this.rootURL}/client/baby`;
    const body = { name: name, gender: gender };
    return this.http.post(url, body);
  }

  clientGetBabyInformation(clientId: string) {
    const params = new HttpParams().set("clientId", clientId);
    const url = `${this.rootURL}/client/baby`;
    return this.http.get(url, { params: params });
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

  getDetectedEvents(clientId: string) {
    const params = new HttpParams().set("clientId", clientId);
    const url = `${this.rootURL}/detected-event/all`;
    return this.http.get(url, { params: params });
  }

  addPushSubscriber(data:any) {
    return this.http.post('/api/notifications/subscribe', data);
  }

  removePushSubscriber(clientId:string) {
    const params = new HttpParams().set("clientId", clientId);
    const url = `${this.rootURL}/notifications/unsubscribe`;
    return this.http.delete(url, { params: params });
  }

  sendNotification(notification) {
    return this.http.post('/api/notifications/submit', notification);
  }

}
