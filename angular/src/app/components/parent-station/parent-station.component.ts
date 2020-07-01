import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
import {DetectedEventListComponent} from "../detected-event-list/detected-event-list.component";
import {OnlineOfflineService} from "../../services/online-offline.service";
import {OfflineAlarmComponent} from "../offline-alarm/offline-alarm.component";
import {HandshakeService} from "../../services/handshake.service";
import {SwPush, SwUpdate} from "@angular/service-worker";
import {NotificationService} from "../../services/notification.service";
import {HeaderService} from "../../services/header.service";

@Component({
  selector: 'bp-parent-station',
  templateUrl: './parent-station.component.html',
  styleUrls: ['./parent-station.component.sass']
})
export class ParentStationComponent implements OnInit, OnDestroy {

  title: string;
  detectedEvents: DetectedEvent[] = [];
  clientId: string;
  subscription: Subscription;
  interval: number;
  babyName: string;
  babyGender: string;

  subscriber: PushSubscription;
  readonly VAPID_PUBLIC_KEY = "BAhrrCzKYBzAiPwPjaH_kKHh7PrYCCKlEYBIINqnCIgGIBTqo58ciDXXZeo54jSpuDaOVURLKjEXNo3sYl-Tngs";

  @ViewChild('detectedEvents') detectedEventList: DetectedEventListComponent;
  @ViewChild('offlineAlarm') offlineAlarm: OfflineAlarmComponent;

  constructor(
    private readonly detectedEventService: DetectedEventService,
    private route: ActivatedRoute,
    private onlineOfflineService: OnlineOfflineService,
    private handshakeService: HandshakeService,
    private swPush: SwPush,
    private notificationService: NotificationService,
    private headerService: HeaderService
  ) {
    this.interval = 1000 * 5;
  }

  ngOnInit() {
    this.headerService.setTitle('Parent Station');
    this.headerService.setBackButtonLink('/connection');
    this.subscribeToNotifications();
    this.subscription = this.route.params
      .subscribe(params => {
        this.clientId = params['id'] || '';
        this.fetch();
      });

    setInterval(() => { this.fetch() }, this.interval);
  }

  ngOnDestroy() {
    this.detectedEventService.destroyAllEvents();
    this.subscription.unsubscribe();
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

  fetch() {
    if (this.clientId === '') { return; }

    if (!this.onlineOfflineService.online) {
      if (this.offlineAlarm) { this.offlineAlarm.noInternet(); }
      return;
    }

    this.onlineOfflineService.serverOnline().subscribe(() => {
      if (this.offlineAlarm) { this.offlineAlarm.inactive(); }
      this.handshakeService.getBabyInformation(this.clientId).subscribe((babyInformation: any) => {
        this.babyName = babyInformation.name;
        this.babyGender = babyInformation.gender;
        console.log('Baby Information:', babyInformation);
      });
      this.detectedEventService.getDetectedEventsFromServer(this.clientId).subscribe((detectedEvents: DetectedEvent[]) => {
        this.detectedEventList.detectedEvents = detectedEvents;
      });
    }, error => {
      if (this.offlineAlarm) { this.offlineAlarm.noServer(); }
    });

  }

}
