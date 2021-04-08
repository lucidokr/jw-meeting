
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {HttpClientModule, RequestOptions, XHRBackend} from '@angular/http';
import {routing, RootComponent} from './routes';
import {
  MdButtonModule, MatInputModule, MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatSidenavModule,
  MdSelectModule, MatCardModule, MatAutocompleteModule, MatTabsModule, MatIconModule, MatNativeDateModule, MatSnackBarModule,
  MdSlideToggleModule, DateAdapter, MD_DATE_FORMATS, MatGridListModule, MatProgressBarModule
} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import * as moment from 'moment';
import 'moment/locale/it';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import {Router} from "@angular/router";

import {DialogModule} from "./dialog.module";

import {ContainerComponent} from './components/container.component';
import {HeaderComponent} from './components/header.component';
import {HomeComponent} from './components/home/home.component';
import {MaterialTableComponent} from "./components/material-table/material-table.component";
import {HistoryListComponent} from "./components/student/history/list-history.component";
import {StudentListComponent} from "./components/student/list/list-student.component";
import {StudentDetailComponent} from "./components/student/detail/detail-student.component";
import {NewPgmComponent} from "./components/new-pgm/new-pgm.component";
import {NewPgmPreviewComponent} from "./components/new-pgm/new-pgm-preview.component";
import {NewPgmConfigComponent} from "./components/new-pgm/new-pgm-config.component";
import {MeetingListComponent} from "./components/meeting/list/list-meeting.component";
import {MeetingDetailComponent} from "./components/meeting/detail/detail-meeting.component";
import {PrayerListComponent} from "./components/prayer/list/list-prayer.component";
import {LoaderComponent} from "./shared/components/loader.component";
import {ServantListComponent} from "./components/servant/list/list-servant.component";
import {ElderListComponent} from "./components/elder/list/list-elder.component";
import {DateRenderComponent} from "./shared/components/dateRender.component";
import {BooleanRenderComponent} from "./shared/components/booleanRender.component";
import {GeneralListComponent} from "./shared/components/list.component";
import {BrotherListComponent} from "./components/brother/list/list-brother.component";
import {WeekComponent} from "./shared/components/week.component";
import {ReaderListComponent} from "./components/reader/list/list-reader.component";
import {WeekUpdateComponent} from "./shared/components/weekUpdate.component";
import {LoginComponent} from "./components/login/login.component";
import {DownloadRenderComponent} from "./shared/components/downloadRender.component";
import {ViewRenderComponent} from "./shared/components/viewRender.component";
import {StatisticsComponent} from "./components/statistics/statistics.component";
import {NewPgmTempComponent} from "./components/new-pgm/new-pgm-temp.component";
import { SettingsComponent } from './components/settings/settings.component';

import {StickyDirective} from "./shared/directives/sticky.directive";

import {HttpInterceptor, HttpInterceptorFactory} from "./shared/http-interceptor.service";
import {BrotherService} from "./services/brother.service";
import {HistoryService} from "./services/history.service";
import {StudentService} from "./services/student.service";
import {PrayerService} from "./services/prayer.service";
import {ServantService} from "./services/servant.service";
import {ElderService} from "./services/elder.service";
import {DialogService} from "./services/dialog.service";
import {WTJService} from "./services/wtj.service";
import {EmitterService} from "./services/emitter.service";
import {NewPgmService} from "./services/new-pgm.service";
import {MeetingService} from "./services/meeting.service";
import {ReaderService} from "./services/reader.service";
import {AuthService} from "./services/auth.service";
import { CongregationService } from './services/congregation.service';

import {MomentDateAdapter, MOMENT_DATE_FORMATS} from "./shared/moment.adapter";

import {SafeHtmlPipe} from "./pipes/safe.pipe";
import {KeysPipe} from "./pipes/keys.pipe";
import {AuthGuard} from "./guards/auth.guard";
import {WeekTempComponent} from "./shared/components/week-temp/week-temp.component";
import {MeetingDetailTempComponent} from "./components/meeting/detail-temp/detail-meeting-temp.component";
import {PipeModule} from "./pipe.module";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    routing,
    HttpClientModule,
    MdButtonModule, MatInputModule, MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatSidenavModule, MatSelectModule, MatCardModule, MatAutocompleteModule, MatTabsModule, MatIconModule, MatNativeDateModule, MatSnackBarModule, MatSlideToggleModule, MatGridListModule, MatProgressBarModule,
    DialogModule,
    FlexLayoutModule,
    Ng2SmartTableModule,
    AmChartsModule,
    Angular2FontawesomeModule,
    PipeModule
  ],
  declarations: [
    RootComponent,
    ContainerComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    GeneralListComponent,
    HistoryListComponent,
    StudentListComponent,
    BrotherListComponent,
    ReaderListComponent,
    StudentDetailComponent,
    NewPgmComponent,
    NewPgmConfigComponent,
    NewPgmPreviewComponent,
    MeetingListComponent,
    MeetingDetailComponent,
    PrayerListComponent,
    MaterialTableComponent,
    LoaderComponent,
    ServantListComponent,
    ElderListComponent,
    WeekComponent,
    DateRenderComponent,
    BooleanRenderComponent,
    DownloadRenderComponent,
    ViewRenderComponent,
    StatisticsComponent,
    NewPgmTempComponent,
    MeetingDetailTempComponent,
    WeekTempComponent,
    WeekUpdateComponent,
    SettingsComponent,

    KeysPipe,

    StickyDirective
  ],
  providers: [
    HistoryService,
    StudentService,
    PrayerService,
    ServantService,
    ElderService,
    DialogService,
    WTJService,
    EmitterService,
    NewPgmService,
    BrotherService,
    MeetingService,
    ReaderService,
    AuthService,
    CongregationService,
    AuthGuard,
    {provide: DateAdapter, useClass: MomentDateAdapter },
    {provide: MD_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS},
    {
      provide: HttpInterceptor,
      useFactory: HttpInterceptorFactory,
      deps: [XHRBackend, RequestOptions, Router, DialogService]
    }
    ],
  entryComponents: [
    DateRenderComponent,
    BooleanRenderComponent,
    DownloadRenderComponent,
    ViewRenderComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
