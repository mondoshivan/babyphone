import {Injectable, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';
import {ApiService} from "./api.service";
import {takeUntil} from "rxjs/operators";

declare const window: any;

@Injectable({ providedIn: 'root' })
export class OnlineOfflineService implements OnDestroy{

  private internalConnectionChanged = new Subject<boolean>();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService) {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  get connectionChanged() {
    return this.internalConnectionChanged.asObservable();
  }

  get online() {
    return !!window.navigator.onLine;
  }

  serverOnline() {
    return this.apiService.ping().pipe(takeUntil(this.destroy$));
  }

  private updateOnlineStatus() {
    this.internalConnectionChanged.next(window.navigator.onLine);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
