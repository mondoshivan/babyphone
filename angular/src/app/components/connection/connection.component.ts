import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DetectedEvent} from "../detected-event/detected-event";
import {DetectedEventService} from "../../services/detected-event.service";
import {HandshakeService} from "../../services/handshake.service";
import {ClientListComponent} from "../client-list/client-list.component";
import {HeaderService} from "../../services/header.service";

@Component({
  selector: 'bp-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.sass']
})
export class ConnectionComponent implements AfterViewInit, OnInit, OnDestroy {

  title: string;
  interval: number = 1000 * 5;
  detectedEvents: DetectedEvent[] = [];
  connectionsInterval: any;

  @ViewChild('clients') clientListComponent: ClientListComponent;

  constructor(
    private readonly detectedEventService: DetectedEventService,
    private handshakeService: HandshakeService,
    private headerService: HeaderService
  ) {}

  ngOnDestroy(): void {
    clearInterval(this.connectionsInterval);
  }

  ngOnInit(): void {
    this.headerService.setTitle('Choose a Connection');
    this.headerService.setBackButtonLink('/');
    this.headerService.setEnableNavbar(false);
  }

  ngAfterViewInit() {
    this.connectionsInterval = setInterval(() => { this.getConnections() }, this.interval);
  }

  getConnections() {
    this.handshakeService.overview((clients) => {
      this.clientListComponent.clients = clients;
    });
  }

}
