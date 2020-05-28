import {Component, Input, OnInit} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";

@Component({
  selector: 'bp-detected-event-list',
  templateUrl: './detected-event-list.component.html',
  styleUrls: ['./detected-event-list.component.sass']
})
export class DetectedEventListComponent implements OnInit {

  detectedEvents: DetectedEvent[];

  // @Input()
  // set detectedEvent(dEvent: DetectedEvent) {
  //   this.detectedEvents.push(dEvent);
  // }

  constructor() {
    this.detectedEvents = [];
  }

  ngOnInit(): void {
  }

}
