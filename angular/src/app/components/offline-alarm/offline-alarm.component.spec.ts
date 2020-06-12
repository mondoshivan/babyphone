import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineAlarmComponent } from './offline-alarm.component';

describe('OfflineAlarmComponent', () => {
  let component: OfflineAlarmComponent;
  let fixture: ComponentFixture<OfflineAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
