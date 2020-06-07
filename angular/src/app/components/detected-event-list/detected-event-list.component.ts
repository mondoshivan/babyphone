import {Component, OnDestroy, OnInit} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {MicrophoneService} from "../../services/microphone.service";
import {DetectedEventService} from "../../services/detected-event.service";

@Component({
  selector: 'bp-detected-event-list',
  templateUrl: './detected-event-list.component.html',
  styleUrls: ['./detected-event-list.component.sass']
})
export class DetectedEventListComponent implements OnInit, OnDestroy {

  detectedEvents: DetectedEvent[] = [];

  constructor(private detectedEventService: DetectedEventService) {

  }

  ngOnInit(): void {
    this.detectedEvents = this.detectedEventService.getAllDetectedEvents();
  }

  ngOnDestroy(): void {
    this.detectedEvents = this.detectedEventService.destroyAllEvents();
  }

}
