import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { appRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VolumeLedListComponent } from './components/volume-led-list/volume-led-list.component';
import { VolumeLedComponent } from './components/volume-led/volume-led.component';
import { DetectedEventComponent } from './components/detected-event/detected-event.component';
import { DetectedEventListComponent } from './components/detected-event-list/detected-event-list.component';
import { MicrophoneService } from "./services/microphone.service";
import { IndexComponent } from './components/index/index.component';
import { BabyStationComponent } from './components/baby-station/baby-station.component';
import { ParentStationComponent } from './components/parent-station/parent-station.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OnlineOfflineService} from "./services/online-offline.service";
import { DetectedEventService} from "./services/detected-event.service";
import { HandshakeService} from "./services/handshake.service";
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientComponent} from "./components/client/client.component";
import { ConnectionComponent } from './components/connection/connection.component';
import { OfflineAlarmComponent } from './components/offline-alarm/offline-alarm.component';
import { StorageService} from "./services/storage-service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HeaderComponent } from './components/header/header.component';
import {HeaderService} from "./services/header.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    VolumeLedListComponent,
    VolumeLedComponent,
    DetectedEventComponent,
    DetectedEventListComponent,
    IndexComponent,
    BabyStationComponent,
    ParentStationComponent,
    NotFoundComponent,
    ClientListComponent,
    ClientComponent,
    ConnectionComponent,
    OfflineAlarmComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    appRouting,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule
  ],
  entryComponents: [AppComponent],
  providers: [
    { provide: MicrophoneService, useClass: MicrophoneService },
    { provide: OnlineOfflineService, useClass: OnlineOfflineService },
    { provide: DetectedEventService, useClass: DetectedEventService },
    { provide: HandshakeService, useClass: HandshakeService },
    { provide: StorageService, useClass: StorageService },
    { provide: HeaderService, useClass: HeaderService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
