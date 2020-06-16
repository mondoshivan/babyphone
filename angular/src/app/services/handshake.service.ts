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

  sendBabyInformation(name: string, gender: string) {
    this.apiService.clientPostBabyInformation(name, gender).pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log('Baby Information is send.');
    });
  }

  getBabyInformation(clientId: string) {
    return this.apiService.clientGetBabyInformation(clientId).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
