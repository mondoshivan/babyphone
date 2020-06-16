import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subject } from 'rxjs';
import {SwPush, SwUpdate} from "@angular/service-worker";
import {OnlineOfflineService} from "./services/online-offline.service";
import {NotificationService} from "./services/notification.service";

@Component({
  selector: 'bp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Babyphone';
  destroy$: Subject<boolean> = new Subject<boolean>();

  subscriber: PushSubscription;
  readonly VAPID_PUBLIC_KEY = "BFO9dgJQ3Ddz7E6KFIA5f7u7o0ZjLLhJmYUN-280R8_qmOiWKOxP15BXj3opNvjEu9Z70lOGwJesRtTLPUzvgaU";

  constructor(
    public readonly onlineOfflineService: OnlineOfflineService,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private notificationService: NotificationService
  ) {

  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(subscriber => {
        this.subscriber = subscriber;
        console.log("Notification Subscription: ", subscriber);

        this.notificationService.addPushSubscriber(subscriber).subscribe(
          () => console.log('Sent push subscription object to server.'),
          err => console.log('Could not send subscription object to server, reason: ', err)
        );
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
  }

  sendNotification() {
    console.log("Sending Notification to all Subscribers ...");
    this.notificationService.send({test: 'notification works'}).subscribe(
      () => console.log('Sent push notification.'),
      err => console.log('Could not send notification, reason: ', err)
    );
  }
}
