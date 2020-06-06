import {Component} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {MicrophoneService} from "../services/microphone.service";

@Component({
  selector: 'bp-detected-event-list',
  templateUrl: './detected-event-list.component.html',
  styleUrls: ['./detected-event-list.component.sass']
})
export class DetectedEventListComponent {

  threshold: number;
  detectedEvents: DetectedEvent[];
  lastDetectedEvent: number;
  durationBetweenEvents: number;

  constructor(public microphoneService:MicrophoneService) {
    this.detectedEvents = [];
    this.threshold = 70;
    this.lastDetectedEvent = 0;
    this.durationBetweenEvents = 1000 * 5;

    this.microphoneService.subject.subscribe((volume) => {
      if (volume < this.threshold) { return; }
      const now = Date.now();
      if (now - this.durationBetweenEvents < this.lastDetectedEvent) { return; }
      this.detectedEvents.push(this.getEvent(now, volume));
    });
  }

  getEvent(timestamp:number, volume:number) {
    this.lastDetectedEvent = timestamp;
    return new DetectedEvent(this.lastDetectedEvent, volume);
  }

}
