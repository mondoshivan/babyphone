import {Component, OnInit, ViewChild} from '@angular/core';
import { OnlineOfflineService } from "../../services/online-offline.service";
import {HeaderService} from "../../services/header.service";
import {DetectedEventListComponent} from "../detected-event-list/detected-event-list.component";
import {DetectedEventService} from "../../services/detected-event.service";
import {DetectedEvent} from "../detected-event/detected-event";

@Component({
  selector: 'bp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  title: string = 'Baby Phone';
  backButtonLink: string;
  navbarEnabled: boolean = false;
  interval: number = 1000 * 5;
  @ViewChild('detectedEvents') detectedEventList: DetectedEventListComponent;

  constructor(
    public readonly onlineOfflineService: OnlineOfflineService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.getTitle().subscribe(title => this.title = title);
    this.headerService.getBackButtonLink().subscribe(link => this.backButtonLink = link);
    this.headerService.getEnableNavbar().subscribe(enabled => this.navbarEnabled = enabled);

    setInterval(async () => {
      this.headerService.getDetectedEvents().subscribe(events => {
        console.log("header - events", events);
        this.detectedEventList.detectedEvents = events
      })
    }, this.interval);
  }

  changeSensitivity(value: number) {
    console.log('sensitivity: ', value);
  }

}
