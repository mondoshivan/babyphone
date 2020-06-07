import {Injectable, OnDestroy} from '@angular/core';
import { OnlineOfflineService } from './online-offline.service';
import { DetectedEvent } from "../components/detected-event/detected-event";
import Dexie from "dexie";
import { UUID } from 'angular2-uuid';
import {ApiService} from "./api.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/index";


@Injectable({ providedIn: 'root' })
export class DetectedEventService implements OnDestroy{

  private detectedEvents: DetectedEvent[] = [];
  private db: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly onlineOfflineService: OnlineOfflineService,
    private apiService: ApiService
  ) {
    this.registerToEvents(onlineOfflineService);
    this.createDatabase();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  addDetectedEvent(detectedEvent:DetectedEvent) {
    console.log('adding detected event');
    detectedEvent.id = UUID.UUID();
    this.detectedEvents.push(detectedEvent);

    if (this.onlineOfflineService.isOnline) {
      console.log('sending it to the server');
      this.sendItem(detectedEvent)
    } else {
      console.log('storing it locally');
      this.addToIndexedDb(detectedEvent);
    }
  }

  destroyAllEvents() {
    // delete all events on server
    console.log('destroying all events');
    this.detectedEvents = [];
    return this.detectedEvents;
  }

  getAllDetectedEvents() {
    return this.detectedEvents;
  }

  private createDatabase() {
    console.log('creating the database');
    this.db = new Dexie('Babyphone');
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

  private async sendItemsFromIndexedDb() {
    console.log('sending all stored events');
    const detectedEvents: DetectedEvent[] = await this.db.detectedEvents.toArray();

    detectedEvents.forEach((item: DetectedEvent) => {
      this.sendItem(item);
      this.db.detectedEvents.delete(item.id).then(() => {
        console.log(`item ${item.id} sent and deleted locally`);
      });
    });
  }

  private sendItem(detectedEvent: DetectedEvent) {
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

        this.sendItemsFromIndexedDb();
      } else {
        console.log('went offline, storing in indexdb');
      }
    });
  }
}
