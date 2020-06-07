import {Component, OnDestroy} from '@angular/core';
import { ApiService } from './services/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {OnlineOfflineService} from "./services/online-offline.service";

@Component({
  selector: 'bp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy  {

  constructor(
    private apiService: ApiService,
    public readonly onlineOfflineService: OnlineOfflineService) {

  }

  title = 'Babyphone';
  hellos: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  getHello() {
    this.apiService.getHello().pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
      this.hellos = hellos;
      console.log("say hello");
      console.log(this.hellos);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
