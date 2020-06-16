import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'bp-offline-alarm',
  templateUrl: './offline-alarm.component.html',
  styleUrls: ['./offline-alarm.component.sass']
})
export class OfflineAlarmComponent implements OnInit {

  alarm: boolean = false;
  message: string;

  constructor() {}

  active(message='') {
    this.alarm = true;
    this.message = message && message !== '' ? message : '';
  }

  noInternet() {
    this.active('Internet connection is lost');
  }

  noServer() {
    this.active('Connection to Server is lost');
  }

  inactive() {
    this.alarm = false;
  }

  ngOnInit(): void {
  }

}
