import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({ providedIn: 'root' })
export class MicrophoneService {

  subject:BehaviorSubject<number>;
  volume: number;
  constraints: object;
  stream: MediaStream;

  constructor() {
    this.volume = 0;
    this.constraints = { audio: true, video: false };
  }

  enable() {
    console.log('enabling mic');
    this.subject = new BehaviorSubject<number>(this.volume);
    this.getMedia(this.constraints).catch(error => {console.log(error)});
  }

  disable() {
    console.log('disabling mic');
    this.stream.getAudioTracks()[0].enabled = false;
    this.subject = null;
  }

  async getMedia(constraints) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.volumeProcess(this.stream);

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
      if (this.subject) {
        this.subject.next(this.volume);
      }
    }
  }

}
