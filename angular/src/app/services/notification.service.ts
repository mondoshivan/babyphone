import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private apiService: ApiService) {

  }

  addPushSubscriber(subscriber) {
    return this.apiService.addPushSubscriber(subscriber);
  }

  send(notification) {
    return this.apiService.sendNotification(notification);
  }

}
