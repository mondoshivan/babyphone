import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentStationComponent } from './parent-station.component';

describe('ParentStationComponent', () => {
  let component: ParentStationComponent;
  let fixture: ComponentFixture<ParentStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
