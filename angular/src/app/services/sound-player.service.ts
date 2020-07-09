import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class SoundPlayerService {

  public activeAlarmSound: string;
  public soundFiles = {
    shipBell: './assets/sound/ship-bell.mp3',
    siren: './assets/sound/siren.mp3',
    fogHorn: './assets/sound/foghorn.mp3',
    noSound: 'no-sound'
  };
  private defaultAlarmSound: string = this.soundFiles.fogHorn;
  private cookieNameAlarmSound: string = 'alarm-sound';

  constructor(private cookieService: CookieService) { }

  public play() {
    const sound = this.getAlarmSound();
    if (sound === this.soundFiles.noSound) { return; }
    this.playSound(sound);
  }

  private getAlarmSound() {
    const alarmSound = this.cookieService.get(this.cookieNameAlarmSound);
    return alarmSound === '' ? this.defaultAlarmSound : alarmSound;
  }

  private playSound(soundFile) {
    if (soundFile !== undefined) {
      const sound = new Howl({
        src: [soundFile]
      });
      sound.play();
    }
  }
}
