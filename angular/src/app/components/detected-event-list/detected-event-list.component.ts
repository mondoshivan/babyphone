import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";

@Component({
  selector: 'bp-detected-event-list',
  templateUrl: './detected-event-list.component.html',
  styleUrls: ['./detected-event-list.component.sass']
})
export class DetectedEventListComponent implements OnInit, OnDestroy {

  @Input() detectedEvents: DetectedEvent[] = [];

  constructor(private detectedEventService: DetectedEventService) {

  }

  ngOnInit(): void {
    this.detectedEventService.getDetectedEvents()
      .then(detectedEvents => {
        this.detectedEvents = detectedEvents;
      }
    );
  }

  ngOnDestroy(): void {
    //this.detectedEvents = this.detectedEventService.destroyAllEvents();
  }

}
