
export class DetectedEvent {

  id: string;
  timestamp: number;
  loudness: number;

  constructor(timestamp:number, loudness:number) {
    this.timestamp = timestamp;
    this.loudness = loudness;
  }

}
