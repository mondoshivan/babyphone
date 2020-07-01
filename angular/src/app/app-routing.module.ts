import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from "./components/index/index.component";
import {BabyStationComponent} from "./components/baby-station/baby-station.component";
import {ParentStationComponent} from "./components/parent-station/parent-station.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {ConnectionComponent} from "./components/connection/connection.component";

const routes: Routes = [
  {path: '', component: IndexComponent}, // Dashboard unter /dashboard
  {path: 'baby-station', component: BabyStationComponent},
  {path: 'parent-station/:id', component: ParentStationComponent},
  {path: 'connection', component: ConnectionComponent},

  /** Redirect Konfigurationen **/
  {path: '**', component: NotFoundComponent}, // immer als letztes konfigurieren - erste Route die matched wird angesteuert
];

export const appRouting = RouterModule.forRoot(routes);
