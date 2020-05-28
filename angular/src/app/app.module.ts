import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { VolumeLedListComponent } from './volume-led-list/volume-led-list.component';
import { VolumeLedComponent } from './volume-led/volume-led.component';
import { DetectedEventComponent } from './detected-event/detected-event.component';
import { DetectedEventListComponent } from './detected-event-list/detected-event-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    VolumeLedListComponent,
    VolumeLedComponent,
    DetectedEventComponent,
    DetectedEventListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
