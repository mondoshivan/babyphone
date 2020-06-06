import {Component, NgZone, OnDestroy} from '@angular/core';
import {VolumeLed} from "../volume-led/volume-led";
import {MicrophoneService} from "../services/microphone.service";

@Component({
  selector: 'bp-volume-led-list',
  templateUrl: './volume-led-list.component.html',
  styleUrls: ['./volume-led-list.component.sass']
})
export class VolumeLedListComponent implements OnDestroy{

  volume: number;
  volumeLeds: VolumeLed[];

  constructor(private zone:NgZone, public microphoneService:MicrophoneService) {
    const volumeLedAmount = 10;
    this.volumeLeds = this.getVolumeLeds(volumeLedAmount);

    this.microphoneService.subject.subscribe((volume) => {
      this.volume = volume;
      this.colorLEDs(volume);
    });
  }

  ngOnDestroy() {
    this.microphoneService.subject.unsubscribe();
  }

  getVolumeLeds(amount:number) {
    let leds = [];
    for (let i=0; i<amount; i++) {
      leds.push(new VolumeLed());
    }
    return leds;
  }

  colorLEDs(volume:number) {
    this.zone.run(() => {
      const volumeLedAmount = this.volumeLeds.length;
      let ledAmount = Math.round(volume/volumeLedAmount);
      let loudnessRange = this.volumeLeds.slice(0, ledAmount);
      for (let i = 0; i < this.volumeLeds.length; i++) {
        this.volumeLeds[i].color = VolumeLed.defaultColor();
      }
      for (let i = 0; i < loudnessRange.length; i++) {
        if (i < 5 ) {
          loudnessRange[i].setColor("green");
        } else if (i >= 5 && i < 8 ) {
          loudnessRange[i].setColor("yellow");
        } else {
          loudnessRange[i].setColor("red");
        }
      }
    });
  }

}
