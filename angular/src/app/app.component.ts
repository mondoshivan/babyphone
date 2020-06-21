import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subject } from 'rxjs';
import {SwPush, SwUpdate} from "@angular/service-worker";
import {OnlineOfflineService} from "./services/online-offline.service";
import {NotificationService} from "./services/notification.service";

@Component({
  selector: 'bp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Babyphone';
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    public readonly onlineOfflineService: OnlineOfflineService,
  ) {

  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
