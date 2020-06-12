import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";
import {HandshakeService} from "../../services/handshake.service";
import {ClientListComponent} from "../client-list/client-list.component";

@Component({
  selector: 'bp-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.sass']
})
export class ConnectionComponent implements AfterViewInit {

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
