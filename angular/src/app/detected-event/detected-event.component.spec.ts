import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectedEventComponent } from './detected-event.component';

describe('DetectedEventComponent', () => {
  let component: DetectedEventComponent;
  let fixture: ComponentFixture<DetectedEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectedEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
