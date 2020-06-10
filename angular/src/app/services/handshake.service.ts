import {Injectable, OnDestroy} from '@angular/core';
import {ApiService} from "./api.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Rx";

@Injectable({ providedIn: 'root' })
export class HandshakeService implements OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly apiService: ApiService) {

  }

  reachOut() {
    this.apiService.clientAvailable().pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      console.log("say hello");
      console.log(hellos);
    });
  }

  retract() {
    this.apiService.clientDisabled().pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      console.log("say hello");
      console.log(hellos);
    });
  }

  overview(cb) {
    this.apiService.clientsAvailable().pipe(takeUntil(this.destroy$)).subscribe((clients: any[]) => {
      cb(clients);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
