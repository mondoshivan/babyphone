import { Component, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'bp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy  {

  constructor(private appService: AppService) {
  }

  title = 'Babyphone';
  hellos: any[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();

  getHello() {
    this.appService.getHello().pipe(takeUntil(this.destroy$)).subscribe((hellos: any[]) => {
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
