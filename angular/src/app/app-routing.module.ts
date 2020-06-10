import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from "./components/index/index.component";
import {BabyStationComponent} from "./components/baby-station/baby-station.component";
import {ParentStationComponent} from "./components/parent-station/parent-station.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";

const routes: Routes = [
  {path: '', component: IndexComponent, data: {title: 'Startseite'}}, // Dashboard unter /dashboard
  {path: 'baby-station', component: BabyStationComponent, data: {title: 'Über uns'}},
  {path: 'parent-station', component: ParentStationComponent, data: {title: 'Über uns'}},

  /** Redirect Konfigurationen **/
  {path: '**', component: NotFoundComponent}, // immer als letztes konfigurieren - erste Route die matched wird angesteuert
];

export const appRouting = RouterModule.forRoot(routes);
