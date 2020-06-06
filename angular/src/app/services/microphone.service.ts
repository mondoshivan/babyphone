import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MicrophoneService {

  subject:BehaviorSubject<number>;
  volume: number;

  constructor() {
    this.volume = 0;
    this.subject = new BehaviorSubject<number>(this.volume);
    const constraints = { audio: true, video: false };
    this.getMedia(constraints).catch(error => {console.log(error)});
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
      this.volume = values / length;
      this.subject.next(this.volume);
    }
  }

}
