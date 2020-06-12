import {Component, OnDestroy, OnInit} from '@angular/core';
import {MicrophoneService} from "../../services/microphone.service";
import {DetectedEventService} from "../../services/detected-event.service";
import {DetectedEvent} from "../detected-event/detected-event";
import {HandshakeService} from "../../services/handshake.service";
import {OnlineOfflineService} from "../../services/online-offline.service";

declare const window: any;

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
    private detectedEventService: DetectedEventService,
    private handshakeService: HandshakeService,
    private onlineOfflineService: OnlineOfflineService
  ) {
    this.threshold = 70;
    this.lastDetectedEvent = 0;
    this.durationBetweenEvents = 1000 * 5;
    this.handshakeService.reachOut();
    this.registerToEvents(onlineOfflineService);
  }

  private registerToEvents(onlineOfflineService: OnlineOfflineService) {
    onlineOfflineService.connectionChanged.subscribe(online => {
      if (online) {
        this.detectedEventService.sendDetectedEvents().catch(error => { console.log(error); });
        this.detectedEventService.cleanDBTable().catch(error => { console.log(error); });
      } else {
        console.log('went offline, storing locally');
      }
    });
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
    this.handshakeService.retract();
    this.detectedEventService.destroyAllEvents();
  }

}
