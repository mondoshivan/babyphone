import {Component, Input, OnInit} from '@angular/core';
import {DetectedEvent} from "./detected-event";

@Component({
  selector: 'bp-detected-event',
  templateUrl: './detected-event.component.html',
  styleUrls: ['./detected-event.component.sass']
})
export class DetectedEventComponent implements OnInit {

  @Input() detectedEvent: DetectedEvent;

  constructor() { }

  ngOnInit(): void {
  }

}
