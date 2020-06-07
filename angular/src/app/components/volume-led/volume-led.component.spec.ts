import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeLedComponent } from './volume-led.component';

describe('VolumeLedComponent', () => {
  let component: VolumeLedComponent;
  let fixture: ComponentFixture<VolumeLedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeLedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeLedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
