import { Component, OnInit } from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";

@Component({
  selector: 'bp-parent-station',
  templateUrl: './parent-station.component.html',
  styleUrls: ['./parent-station.component.sass']
})
export class ParentStationComponent implements OnInit {

  title: string;
  detectedEvents: DetectedEvent[] = [];

  constructor(private readonly detectedEventService: DetectedEventService) {

  }

  ngOnInit(): void {
    this.detectedEvents = this.detectedEventService.getAllDetectedEvents();
  }

}
