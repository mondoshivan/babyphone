import {Component, OnInit, ViewChild} from '@angular/core';
import { OnlineOfflineService } from "../../services/online-offline.service";
import {HeaderService} from "../../services/header.service";
import {DetectedEventListComponent} from "../detected-event-list/detected-event-list.component";
import {DetectedEventService} from "../../services/detected-event.service";
import {DetectedEvent} from "../detected-event/detected-event";
import {SoundPlayerService} from "../../services/sound-player.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'bp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  title: string = 'Baby Phone';
  activeAlarmSound: string;
  defaultAlarmSound: string;
  cookieNameAlarmSound: string = 'alarm-sound';
  backButtonLink: string;
  navbarEnabled: boolean = false;
  interval: number = 1000 * 5;
  @ViewChild('detectedEvents') detectedEventList: DetectedEventListComponent;

  constructor(
    public readonly onlineOfflineService: OnlineOfflineService,
    private headerService: HeaderService,
    public soundPlayerService: SoundPlayerService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.defaultAlarmSound = this.soundPlayerService.soundFiles.fogHorn;
    this.activeAlarmSound = this.getActiveAlarmSound();
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

  setActiveAlarmSound(sound:string) {
    console.log('setting alarm sound: ', sound);
    this.activeAlarmSound = sound;
    this.cookieService.set(this.cookieNameAlarmSound, sound);
    this.soundPlayerService.activeAlarmSound = sound;
  }

  getActiveAlarmSound() {
    const alarmSound = this.cookieService.get(this.cookieNameAlarmSound);
    return alarmSound === '' ? this.defaultAlarmSound : alarmSound;
  }

  changeSensitivity(value: number) {
    console.log('sensitivity: ', value);
  }

}
