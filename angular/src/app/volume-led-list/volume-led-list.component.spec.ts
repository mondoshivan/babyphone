import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeLedListComponent } from './volume-led-list.component';

describe('VolumeLedListComponent', () => {
  let component: VolumeLedListComponent;
  let fixture: ComponentFixture<VolumeLedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeLedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeLedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
