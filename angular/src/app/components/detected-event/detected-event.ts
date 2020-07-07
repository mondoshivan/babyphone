
export class DetectedEvent {

  id: string;
  date: string;

  constructor(public timestamp:number, public volume:number) {
    const dateObject = new Date(timestamp * 1000);
    const hours = dateObject.getHours();
    const minutes = "0" + dateObject.getMinutes();
    const seconds = "0" + dateObject.getSeconds();
    this.date = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

}
