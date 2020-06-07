import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectedEventListComponent } from './detected-event-list.component';

describe('DetectedEventListComponent', () => {
  let component: DetectedEventListComponent;
  let fixture: ComponentFixture<DetectedEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectedEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectedEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
