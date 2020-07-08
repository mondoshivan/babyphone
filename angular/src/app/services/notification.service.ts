import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private apiService: ApiService) {

  }

  addPushSubscriber(data) {
    return this.apiService.addPushSubscriber(data);
  }

  removePushSubscriber(clientId) {
    console.log("removing subscriber", clientId);
    return this.apiService.removePushSubscriber(clientId);
  }

  send(notification) {
    return this.apiService.sendNotification(notification);
  }

}
