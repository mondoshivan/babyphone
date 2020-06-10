import {AfterViewInit, Component, QueryList, ViewChild} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";
import {HandshakeService} from "../../services/handshake.service";
import {ClientListComponent} from "../client-list/client-list.component";

@Component({
  selector: 'bp-parent-station',
  templateUrl: './parent-station.component.html',
  styleUrls: ['./parent-station.component.sass']
})
export class ParentStationComponent implements AfterViewInit {

  title: string;
  detectedEvents: DetectedEvent[] = [];

  @ViewChild('clients') clientListComponent: ClientListComponent;

  constructor(
    private readonly detectedEventService: DetectedEventService,
    private handshakeService: HandshakeService
  ) {

  }

  ngAfterViewInit() {
    this.handshakeService.overview((clients) => {
      this.clientListComponent.clients = clients;
    });
  }

}
