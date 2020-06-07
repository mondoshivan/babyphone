import {Component, OnDestroy, OnInit} from '@angular/core';
import {MicrophoneService} from "../../services/microphone.service";
import {DetectedEventService} from "../../services/detected-event.service";
import {DetectedEvent} from "../detected-event/detected-event";

@Component({
  selector: 'bp-baby-station',
  templateUrl: './baby-station.component.html',
  styleUrls: ['./baby-station.component.sass']
})
export class BabyStationComponent implements OnInit, OnDestroy {

  title: string;

  lastDetectedEvent: number;
  durationBetweenEvents: number;
  threshold: number;

  constructor(
    private microphoneService:MicrophoneService,
    private detectedEventService: DetectedEventService
  ) {
    this.threshold = 70;
    this.lastDetectedEvent = 0;
    this.durationBetweenEvents = 1000 * 5;
  }

  ngOnInit(): void {
    this.microphoneService.enable();

    this.microphoneService.subject.subscribe((volume) => {
      if (volume < this.threshold) { return; }
      const now = Date.now();
      if (now - this.durationBetweenEvents < this.lastDetectedEvent) { return; }
      this.detectedEventService.addDetectedEvent(
        this.getDetectedEvent(now, volume)
      );
    });
  }

  getDetectedEvent(timestamp:number, volume:number) {
    this.lastDetectedEvent = timestamp;
    return new DetectedEvent(this.lastDetectedEvent, volume);
  }

  ngOnDestroy(): void {
    this.microphoneService.subject.unsubscribe();
    this.microphoneService.disable();
  }

}
