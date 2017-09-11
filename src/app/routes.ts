import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {StudentListComponent} from "./components/student/list/list-student.component";
import {StudentDetailComponent} from "./components/student/detail/detail-student.component";
import {MeetingDetailComponent} from "./components/meeting/detail/detail-meeting.component";
import {MeetingListComponent} from "./components/meeting/list/list-meeting.component";
import {PrayerListComponent} from "./components/prayer/list/list-prayer.component";
import {ServantListComponent} from "./components/servant/list/list-servant.component";
import {ElderListComponent} from "./components/elder/list/list-elder.component";
import {NewPgmConfigComponent} from "./components/new-pgm/new-pgm-config.component";
import {NewPgmComponent} from "./components/new-pgm/new-pgm.component";
import {NewPgmPreviewComponent} from "./components/new-pgm/new-pgm-preview.component";
import {BrotherListComponent} from "./components/brother/list/list-brother.component";
import {ReaderListComponent} from "./components/reader/list/list-reader.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {StatisticsComponent} from "./components/statistics/statistics.component";
import {MeetingDetailTempComponent} from "./components/meeting/detail-temp/detail-meeting-temp.component";

@Component({
  selector: 'app',
  template: `<container></container>`
})
export class RootComponent { }

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student',
    component: StudentListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student/:studentId',
    component: StudentDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'meeting',
    component: MeetingListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'meeting/:meetingId',
    component: MeetingDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'meeting/temp/:meetingId',
    component: MeetingDetailTempComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'program/new',
    component: NewPgmComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prayer',
    component: PrayerListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brother',
    component: BrotherListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'servant',
    component: ServantListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'elder',
    component: ElderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reader',
    component: ReaderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard]
  },

];

export const routing = RouterModule.forRoot(routes);
