
export class VolumeLed {

  color: string;

  static defaultColor() {
    return "grey";
  }

  constructor() {
    this.color = VolumeLed.defaultColor();
  }

  setColor(color) {
    this.color = color;
  }

}
