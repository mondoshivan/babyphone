import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {OnlineOfflineService} from "../../services/online-offline.service";
import {OfflineAlarmComponent} from "../offline-alarm/offline-alarm.component";
import {HandshakeService} from "../../services/handshake.service";
import {SwPush} from "@angular/service-worker";
import {NotificationService} from "../../services/notification.service";
import {HeaderService} from "../../services/header.service";
import {SoundPlayerService} from "../../services/sound-player.service";

@Component({
  selector: 'bp-parent-station',
  templateUrl: './parent-station.component.html',
  styleUrls: ['./parent-station.component.sass']
})
export class ParentStationComponent implements OnInit, AfterViewInit, OnDestroy {

  title: string;
  detectedEvents: DetectedEvent[] = [];
  clientId: string;
  subscription: Subscription;
  interval: number;
  babyName: string;
  babyGender: string;
  awake: boolean = false;
  awakeTimeout: number = 10000;
  lastDetectedEventListLength: number = 0;
  lastDetectedEvent: DetectedEvent = null;
  fetchInterval: any;

  subscriber: PushSubscription;
  readonly VAPID_PUBLIC_KEY = "BAhrrCzKYBzAiPwPjaH_kKHh7PrYCCKlEYBIINqnCIgGIBTqo58ciDXXZeo54jSpuDaOVURLKjEXNo3sYl-Tngs";

  private ctx: CanvasRenderingContext2D;

  @ViewChild('offlineAlarm') offlineAlarm: OfflineAlarmComponent;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;

  constructor(
    private readonly detectedEventService: DetectedEventService,
    private route: ActivatedRoute,
    private onlineOfflineService: OnlineOfflineService,
    private handshakeService: HandshakeService,
    private swPush: SwPush,
    private notificationService: NotificationService,
    private headerService: HeaderService,
    private soundPlayerService: SoundPlayerService,
    private router: Router
  ) {
    this.interval = 1000 * 5;
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngOnInit() {
    this.headerService.setTitle('Parent Station');
    this.headerService.setBackButtonLink('/connection');
    this.headerService.setEnableNavbar(true);
    this.subscribeToNotifications();
    this.subscription = this.route.params
      .subscribe(params => {
        this.clientId = params['id'] || '';
        this.headerService.setClientId(this.clientId);
        this.fetch();
      });

    this.fetchInterval = setInterval(() => { this.fetch() }, this.interval);
  }

  ngOnDestroy() {
    this.detectedEventService.destroyAllEvents();
    this.subscription.unsubscribe();
    this.notificationService.removePushSubscriber(this.clientId).subscribe(
      () => console.log('Unsubscribed from notifications.'),
      err => console.log('Could not send unsubscribe request, reason: ', err)
    );
    clearInterval(this.fetchInterval);
  }

  enableAlarmColor(): void {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  disableAlarmColor(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(subscriber => {
        this.subscriber = subscriber;
        console.log("Notification Subscription: ", subscriber);
        const data = {
          subscriber: subscriber,
          clientId: this.clientId
        };
        this.notificationService.addPushSubscriber(data).subscribe(
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
      this.soundPlayerService.play();
      return;
    }

    this.onlineOfflineService.serverOnline().subscribe(() => {
      if (this.offlineAlarm) { this.offlineAlarm.inactive(); }
      this.handshakeService.getBabyInformation(this.clientId).subscribe((babyInformation: any) => {
        this.babyName = babyInformation.name;
        this.babyGender = babyInformation.gender;
        console.log(babyInformation);
        if (babyInformation.status === 'disabled') {
          this.router.navigate(['/connection'])
            .then(()=> { console.log('navigating to connection') })
            .catch(error => { console.log("error navigating back: ", error)});
          this.ngOnDestroy();
        }
      });
      this.detectedEventService.getDetectedEventsFromServer(this.clientId).subscribe((detectedEvents: DetectedEvent[]) => {
        if (detectedEvents.length != this.lastDetectedEventListLength) {
          this.headerService.setDetectedEvents(detectedEvents);
          this.lastDetectedEventListLength = detectedEvents.length;
          const lastEvent = detectedEvents[detectedEvents.length - 1];
          this.lastDetectedEvent = lastEvent;
          this.awake = true;
          this.soundPlayerService.play();
          this.enableAlarmColor();
          setTimeout(() => {
            if (this.lastDetectedEvent === lastEvent) {
              this.awake = false;
              this.disableAlarmColor();
            }}, this.awakeTimeout);
        }
      });
    }, error => {
      if (this.offlineAlarm) {
        this.offlineAlarm.noServer();
        this.soundPlayerService.play();
      }
    });

  }

  getBabyImage() {
    return this.awake ? 'assets/img/crying.png' : 'assets/img/sleeping.png';
  }

}
