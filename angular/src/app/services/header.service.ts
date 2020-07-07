import {EventEmitter, Injectable, Output} from '@angular/core';
import {DetectedEvent} from "../components/detected-event/detected-event";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  @Output() title: EventEmitter<any> = new EventEmitter();
  @Output() detectedEvents: EventEmitter<any> = new EventEmitter();
  @Output() backButtonLink: EventEmitter<any> = new EventEmitter();
  @Output() navbar: EventEmitter<any> = new EventEmitter();

  constructor() {}

  setTitle(title: string) {
    this.title.emit(title);
  }

  setEnableNavbar(enable: boolean) {
    this.navbar.emit(enable);
  }

  setDetectedEvents(detectedEvents: DetectedEvent[]) {
    this.detectedEvents.emit(detectedEvents);
  }

  getTitle() {
    return this.title;
  }

  getDetectedEvents() {
    return this.detectedEvents;
  }

  setBackButtonLink(link: string) {
    console.log('header change link', link);
    this.backButtonLink.emit(link);
  }

  getBackButtonLink() {
    return this.backButtonLink;
  }

  getEnableNavbar() {
    return this.navbar;
  }
}
