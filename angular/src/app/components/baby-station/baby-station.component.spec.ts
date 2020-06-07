import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyStationComponent } from './baby-station.component';

describe('BabyStationComponent', () => {
  let component: BabyStationComponent;
  let fixture: ComponentFixture<BabyStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BabyStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
