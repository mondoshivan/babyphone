import {Component, NgZone, OnInit} from '@angular/core';
import { VolumeLed } from "../volume-led/volume-led";
import {DetectedEventComponent} from "../detected-event/detected-event.component";

@Component({
  selector: 'bp-volume-led-list',
  templateUrl: './volume-led-list.component.html',
  styleUrls: ['./volume-led-list.component.sass']
})
export class VolumeLedListComponent implements OnInit {

  volumeLedAmount: number;
  volumeLeds: VolumeLed[];
  average: number;

  constructor(private zone:NgZone) {
    this.volumeLedAmount = 10;
    this.volumeLeds = [];
    for (let i=0; i<this.volumeLedAmount; i++) {
      this.volumeLeds.push(new VolumeLed());
    }
    const constraints = { audio: true, video: false };
    this.getMedia(constraints).catch(error => {console.log(error)});
  }

  ngOnInit(): void {
  }

  async getMedia(constraints) {

      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.volumeProcess(stream);

      } catch(err) {
        console.error(err);
      }
  }

  volumeProcess(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      const length = array.length;
      for (let i = 0; i < length; i++) {
        values += (array[i]);
      }
      this.average = values / length;
      this.colorLEDs(this.average);
    }
  }

  colorLEDs(vol) {
    this.zone.run(() => {
      let ledAmount = Math.round(vol/this.volumeLedAmount);
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
