import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'bp-offline-alarm',
  templateUrl: './offline-alarm.component.html',
  styleUrls: ['./offline-alarm.component.sass']
})
export class OfflineAlarmComponent implements OnInit {

  @Input() alarm: boolean = false;
  offlineAlarmClasses: object = {};

  constructor() {
    this.offlineAlarmClasses = {
      active: this.alarm
    };
  }

  active() {
    this.alarm = true;
  }

  inactive() {
    this.alarm = false;
  }

  ngOnInit(): void {
  }

}
