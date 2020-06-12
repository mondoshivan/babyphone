import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
import {DetectedEventListComponent} from "../detected-event-list/detected-event-list.component";
import {OnlineOfflineService} from "../../services/online-offline.service";
import {OfflineAlarmComponent} from "../offline-alarm/offline-alarm.component";

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

  @ViewChild('detectedEvents') detectedEventList: DetectedEventListComponent;
  @ViewChild('offlineAlarm') offlineAlarm: OfflineAlarmComponent;

  constructor(
    private readonly detectedEventService: DetectedEventService,
    private route: ActivatedRoute,
    private onlineOfflineService: OnlineOfflineService
  ) {
    this.interval = 1000 * 5;
  }

  ngOnInit() {
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

  fetch() {
    if (this.clientId !== '') {
      if (this.onlineOfflineService.isOnline) {
        if (this.offlineAlarm) {
          this.offlineAlarm.alarm = false;
        }
        this.detectedEventService.getDetectedEventsFromServer(this.clientId).subscribe((detectedEvents: DetectedEvent[]) => {
          this.detectedEventList.detectedEvents = detectedEvents === null ? [] : detectedEvents;
        });
      } else {
        if (this.offlineAlarm) {
          this.offlineAlarm.alarm = true;
        }
      }
    }
  }

}
