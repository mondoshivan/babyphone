import {Component, OnDestroy, OnInit} from '@angular/core';
import {MicrophoneService} from "../../services/microphone.service";
import {DetectedEventService} from "../../services/detected-event.service";
import {DetectedEvent} from "../detected-event/detected-event";
import {HandshakeService} from "../../services/handshake.service";
import {OnlineOfflineService} from "../../services/online-offline.service";
import Dexie from "dexie";
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {HeaderService} from "../../services/header.service";

declare const window: any;

@Component({
  selector: 'bp-baby-station',
  templateUrl: './baby-station.component.html',
  styleUrls: ['./baby-station.component.sass']
})
export class BabyStationComponent implements OnInit, OnDestroy {

  babyStation: any;
  babyStationExists: boolean = true;
  lastDetectedEvent: number;
  durationBetweenEvents: number;
  threshold: number;
  db: any;
  babyStationForm;
  genderToggle: string = 'female';

  constructor(
    private microphoneService:MicrophoneService,
    private detectedEventService: DetectedEventService,
    private handshakeService: HandshakeService,
    private onlineOfflineService: OnlineOfflineService,
    private formBuilder: FormBuilder,
    private headerService: HeaderService
  ) {
    this.threshold = 50;
    this.lastDetectedEvent = 0;
    this.durationBetweenEvents = 1000 * 5;
    this.handshakeService.reachOut();
    this.registerToEvents(onlineOfflineService);

    this.babyStationForm = this.formBuilder.group({
      name: ['', Validators.pattern("^[a-zA-Z\\s-]+$")],
      gender: ['', Validators.pattern("^(male|female)$")]
    });
    this.db = new Dexie("MyDatabase");
    this.db.version(1).stores({ babyStation: "++id, babyName, gender" });

    this.babyStationDoesExist().then(exists => {
      this.babyStationExists = exists;
      if (exists) {
        this.getBabyStation().then( babyStation => {
          this.babyStation = babyStation;
          if (this.onlineOfflineService.online) {
            this.handshakeService.reachOut();
          }
        })
      }
    });
  }

  getBabyImage() {
    if (!this.babyStation) { return ''; }
    return this.babyStation.gender === 'male' ? 'assets/img/boy.png' : 'assets/img/girl.png';
  }

  get name() {
    return this.babyStationForm.get('name');
  }

  get gender() {
    return this.babyStationForm.get('gender');
  }

  setGenderToggle(gender) {
    this.genderToggle = gender;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Baby Station');
    this.headerService.setBackButtonLink('/');
    this.setupMicrophone();
    this.detectedEventService.getDetectedEvents()
      .then(detectedEvents => {
        console.log("detectedEvents:", detectedEvents);
      });
  }

  onBabyStationSubmit(data) {
    console.log('onBabyStationSubmit');
    console.log(data);
    this.createBabyStation(data.name, data.gender)
      .then(babyStation => {
        this.babyStation = babyStation;
        this.babyStationExists = true;
        if (this.onlineOfflineService.online) {
          this.handshakeService.sendBabyInformation(data.name, data.gender);
        }
      });
    this.babyStationForm.reset();
  }

  ngOnDestroy(): void {
    this.microphoneService.subject.unsubscribe();
    this.microphoneService.disable();
    this.handshakeService.retract();
    this.detectedEventService.destroyAllEvents();
  }

  private registerToEvents(onlineOfflineService: OnlineOfflineService) {
    onlineOfflineService.connectionChanged.subscribe(online => {
      if (online) {
        console.log('went online');
        this.detectedEventService.sendDetectedEvents().catch(error => { console.log(error); });
        this.handshakeService.sendBabyInformation(this.babyStation.babyName, this.babyStation.gender);
      } else {
        console.log('went offline, storing locally');
      }
    });
  }

  setupMicrophone() {
    this.microphoneService.enable();
    this.microphoneService.subject.subscribe(volume => {
      if (volume < this.threshold) { return; }
      const now = Date.now();
      if (now - this.durationBetweenEvents < this.lastDetectedEvent) { return; }
      this.detectedEventService.addDetectedEvent(this.getDetectedEvent(now, volume));
      console.log('detected events:', this.detectedEventService.getDetectedEvents());
      this.getBabyStation().then(babyStation => { console.log('babystation:', babyStation); });
    });
  }

  editBabyStation() {
    this.deleteBabyStation().catch((error) => { console.log(error);});
  }

  async deleteBabyStation() {
    await this.db.babyStation.clear();
    this.babyStationExists = false;
  }

  async babyStationDoesExist() {
    const result = await this.db.babyStation.limit(1).toArray();
    return result.length === 1;
  }

  async createBabyStation(name, gender) {
    console.log('babystation name: ', name);
    console.log('babystation gender: ', gender);
    return await this.db.babyStation.add({babyName: name, gender: gender});
  }

  async getBabyStation() {
    const babyStations = await this.db.babyStation.limit(1).toArray();
    if (babyStations.length === 1) {
      return babyStations[0];
    }
    throw new Error('Babystation does not exist!');
  }

  getDetectedEvent(timestamp:number, volume:number) {
    this.lastDetectedEvent = timestamp;
    return new DetectedEvent(this.lastDetectedEvent, volume);
  }

}
