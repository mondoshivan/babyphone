import {Injectable, OnDestroy} from '@angular/core';
import { OnlineOfflineService } from './online-offline.service';
import { DetectedEvent } from "../components/detected-event/detected-event";
import Dexie from "dexie";
import { UUID } from 'angular2-uuid';
import {ApiService} from "./api.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Rx";


@Injectable({ providedIn: 'root' })
export class DetectedEventService implements OnDestroy{

  private detectedEvents: DetectedEvent[] = [];
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
    this.detectedEvents.push(detectedEvent);

    if (this.onlineOfflineService.isOnline) {
      this.sendDetectedEvent(detectedEvent)
    } else {
      this.addToDb(detectedEvent);
    }
  }

  destroyAllEvents() {
    console.log('destroying all events');
    this.destroyAllDetectedEvents();
    this.detectedEvents = [];
    this.cleanDBTable().catch(error => { console.log(error); });
    return this.detectedEvents;
  }

  getDetectedEventsFromServer(clientId:string) {
    return this.apiService.getDetectedEvents(clientId).pipe(takeUntil(this.destroy$));
  }

  getDetectedEvents() {
    return this.detectedEvents;
  }

  private createDatabase() {
    console.log('creating the database');
    this.db = new Dexie(this.dbName);
    this.db.version(1).stores({
      detectedEvents: 'id,volume,timestamp'
    });
  }

  async cleanDBTable() {
    const detectedEvents: DetectedEvent[] = await this.db.detectedEvents.toArray();
    detectedEvents.forEach((detectedEvent: DetectedEvent) => {
      this.db.detectedEvents.delete(detectedEvent.id).then(() => {
        console.log(`detected event ${detectedEvent.id} deleted locally`);
      });
    });
  }

  private addToDb(detectedEvent: DetectedEvent) {
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

  private destroyAllDetectedEvents() {
    this.apiService.destroyAllDetectedEvents().pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      console.log("say hello");
      console.log(hellos);
    });
  }

  private sendDetectedEvent(detectedEvent: DetectedEvent) {
    this.apiService.sendDetectedEvent(detectedEvent).pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      console.log("say hello");
      console.log(hellos);
    });
  }

  async sendDetectedEvents() {
    const detectedEvents: DetectedEvent[] = await this.db.detectedEvents.toArray();
    detectedEvents.forEach((detectedEvent: DetectedEvent) => {
      this.sendDetectedEvent(detectedEvent);
    });
  }
}
