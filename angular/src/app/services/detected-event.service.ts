import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { OnlineOfflineService } from './online-offline.service';
import { DetectedEvent } from "../components/detected-event/detected-event";
import Dexie from "dexie";
import { UUID } from 'angular2-uuid';
import {ApiService} from "./api.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Rx";


@Injectable({ providedIn: 'root' })
export class DetectedEventService implements OnDestroy{

  private synchronizedDetectedEvents: DetectedEvent[] = [];
  private dbName: string;
  private db: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly onlineOfflineService: OnlineOfflineService,
    private readonly apiService: ApiService
  ) {
    this.dbName = 'Babyphone';
    this.createDatabase();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  addDetectedEvent(detectedEvent:DetectedEvent) {
    detectedEvent.id = UUID.UUID();
    if (this.onlineOfflineService.online) {
      this.sendDetectedEventToServer(detectedEvent);
      this.synchronizedDetectedEvents.push(detectedEvent);
    } else {
      this.insertLocally(detectedEvent);
    }
  }

  destroyAllEvents() {
    console.log('destroying all events');
    this.truncateOnServer();
    this.synchronizedDetectedEvents = [];
    this.truncateLocally().catch(error => { console.log(error); });
    return this.synchronizedDetectedEvents;
  }

  getDetectedEventsFromServer(clientId:string) {
    return this.apiService.getDetectedEvents(clientId).pipe(takeUntil(this.destroy$));
  }

  async getDetectedEvents() {
    const locally = await this.getDetectedEventsLocally();
    return this.synchronizedDetectedEvents.concat(locally);
  }

  private createDatabase() {
    console.log('creating the database');
    this.db = new Dexie(this.dbName);
    this.db.version(1).stores({
      detectedEvents: 'id,volume,timestamp' // todo: ++id remove uuid
    });
  }

  async truncateLocally() {
    const detectedEvents: DetectedEvent[] = await this.db.detectedEvents.toArray();
    detectedEvents.forEach((detectedEvent: DetectedEvent) => {
      this.deleteDetectedEventLocally(detectedEvent);
    });
  }

  deleteDetectedEventLocally(detectedEvent:DetectedEvent) {
    this.db.detectedEvents.delete(detectedEvent.id).then(() => {
      console.log(`detected event ${detectedEvent.id} deleted locally`);
    });
  }

  private insertLocally(detectedEvent: DetectedEvent) {
    this.db.detectedEvents
      .add(detectedEvent)
      .then(async () => {
        const detectedEvents: DetectedEvent[] = await this.db.detectedEvents.toArray();
        console.log('saved in DB, DB is now', detectedEvents);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }

  private truncateOnServer() {
    this.apiService.destroyAllDetectedEvents().pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      console.log("say hello");
      console.log(hellos);
    });
  }

  private sendDetectedEventToServer(detectedEvent: DetectedEvent) {
    this.apiService.sendDetectedEvent(detectedEvent).pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log('Event send to server:', detectedEvent);
      this.synchronizedDetectedEvents.push(detectedEvent);
    });
  }

  async getDetectedEventsLocally() {
    return await this.db.detectedEvents.toArray();
  }

  async sendDetectedEvents() {
    const detectedEvents: DetectedEvent[] = await this.db.detectedEvents.toArray();
    console.log('handling locally stored events:', detectedEvents);
    detectedEvents.forEach((detectedEvent: DetectedEvent) => {
      this.sendDetectedEventToServer(detectedEvent);
    });
    detectedEvents.forEach((detectedEvent: DetectedEvent) => {
      this.deleteDetectedEventLocally(detectedEvent);
    });
  }
}
