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
    this.registerToEvents(onlineOfflineService);
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
      this.sendToServer(detectedEvent)
    } else {
      this.addToIndexedDb(detectedEvent);
    }
  }

  destroyAllEvents() {
    console.log('destroying all events');
    this.destroyAllDetectedEvents();
    this.detectedEvents = [];
    return this.detectedEvents;
  }

  getAllDetectedEvents() {
    return this.detectedEvents;
  }

  private createDatabase() {
    console.log('creating the database');
    this.db = new Dexie(this.dbName);
    this.db.version(1).stores({
      detectedEvents: 'id,volume,timestamp'
    });
  }

  private addToIndexedDb(detectedEvent: DetectedEvent) {
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

  private async sendDetectedEventsFromIndexedDb() {
    console.log('sending all stored events');
    const detectedEvents: DetectedEvent[] = await this.db.detectedEvents.toArray();

    detectedEvents.forEach((detectedEvent: DetectedEvent) => {
      this.sendToServer(detectedEvent);
      this.db.detectedEvents.delete(detectedEvent.id).then(() => {
        console.log(`detected event ${detectedEvent.id} sent and deleted locally`);
      });
    });
  }

  private destroyAllDetectedEvents() {
    this.apiService.destroyAllDetectedEvents().pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      console.log("say hello");
      console.log(hellos);
    });
  }

  private sendToServer(detectedEvent: DetectedEvent) {
    this.apiService.sendDetectedEvent(detectedEvent).pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      console.log("say hello");
      console.log(hellos);
    });
  }

  private registerToEvents(onlineOfflineService: OnlineOfflineService) {
    onlineOfflineService.connectionChanged.subscribe(online => {
      if (online) {
        console.log('went online');
        console.log('sending all stored items');

        this.sendDetectedEventsFromIndexedDb()
          .catch(error => {
            console.log(error);
        });
      } else {
        console.log('went offline, storing in indexdb');
      }
    });
  }
}
