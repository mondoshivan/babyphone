import { Component, OnInit, Input } from '@angular/core';
import { VolumeLed} from "./volume-led";

@Component({
  selector: 'bp-volume-led',
  template: '<div class="led col-sm" [style.background-color]="led.color"></div>',
  styleUrls: ['./volume-led.component.sass']
})
export class VolumeLedComponent implements OnInit {

  @Input() led: VolumeLed;

  constructor() { }

  ngOnInit(): void {
  }

}
