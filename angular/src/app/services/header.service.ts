import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  @Output() title: EventEmitter<any> = new EventEmitter();
  @Output() backButtonLink: EventEmitter<any> = new EventEmitter();

  constructor() {}

  setTitle(title: string) {
    this.title.emit(title);
  }

  getTitle() {
    return this.title;
  }

  setBackButtonLink(link: string) {
    console.log('header change link', link);
    this.backButtonLink.emit(link);
  }

  getBackButtonLink() {
    return this.backButtonLink;
  }
}
