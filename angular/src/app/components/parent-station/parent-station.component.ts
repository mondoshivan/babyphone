import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
import {ClientListComponent} from "../client-list/client-list.component";
import {DetectedEventListComponent} from "../detected-event-list/detected-event-list.component";

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

  @ViewChild('detectedEvents') detectedEventList: DetectedEventListComponent;

  constructor(
    private readonly detectedEventService: DetectedEventService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.subscription = this.route.params
      .subscribe(params => {
        this.clientId = params['id'] || '';
        if (this.clientId !== '') {
          this.detectedEventService.getDetectedEventsFromServer(this.clientId).subscribe((detectedEvents: DetectedEvent[]) => {
            this.detectedEventList.detectedEvents = detectedEvents === null ? [] : detectedEvents;
          });
        }
      });
  }

  ngOnDestroy() {
    this.detectedEventService.destroyAllEvents();
    this.subscription.unsubscribe();
  }

}
