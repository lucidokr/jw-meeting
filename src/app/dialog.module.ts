import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MdButtonModule, MdInputModule, MdDatepickerModule, MdCheckboxModule, MdRadioModule, MdSidenavModule, MdSelectModule, MdCardModule, MdAutocompleteModule, MdTabsModule} from '@angular/material';

import {NewPrayerDialog} from "./components/prayer/new/new-prayer";
import {NewServantDialog} from "./components/servant/new/new-servant";
import {NewElderDialog} from "./components/elder/new/new-elder";
import {NewStudentDialog} from "./components/student/new/new-student.component";

import {DialogService} from "./services/dialog.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {BrowserModule} from "@angular/platform-browser";
import {ConfirmDialog} from "./shared/components/confirm.component";
import {FilterPipe} from "./pipes/filter.pipe";
import {ErrorDialog} from "./shared/components/error.component";
import {NewBrotherDialog} from "./components/brother/new/new-brother";
import {NewReaderDialog} from "./components/reader/new/new-reader";
import {DownloadWeeksDialog} from "./shared/components/downloadWeeks.component";
import {ChangeNumberDialog} from "./shared/components/changeNumber.component";
import {ChangePartDialog} from "./shared/components/changePart.component";
import {SafeHtmlPipe} from "./pipes/safe.pipe";
import {PipeModule} from "./pipe.module";
import {UsherDialog} from "./components/usher/new/new-usher";
import {AcousticsDialog} from "./components/acoustics/new/new-acoustics";
import {MicOperatorDialog} from "./components/mic-operator/new/new-mic-operator";

@NgModule({
  declarations: [
    NewPrayerDialog,
    NewServantDialog,
    NewElderDialog,
    NewStudentDialog,
    NewBrotherDialog,
    NewReaderDialog,
    UsherDialog,
    AcousticsDialog,
    MicOperatorDialog,
    ConfirmDialog,
    ErrorDialog,
    DownloadWeeksDialog,
    ChangeNumberDialog,
    ChangePartDialog,

    FilterPipe
  ],
  imports: [
    BrowserModule,
    MdButtonModule, MdInputModule, MdDatepickerModule, MdCheckboxModule, MdRadioModule, MdSidenavModule, MdSelectModule, MdCardModule, MdAutocompleteModule, MdTabsModule,
    FormsModule,
    FlexLayoutModule,
    PipeModule
  ],
  exports: [
    NewPrayerDialog,
    NewServantDialog,
    NewElderDialog,
    NewStudentDialog,
    NewBrotherDialog,
    NewReaderDialog,
    UsherDialog,
    AcousticsDialog,
    MicOperatorDialog,
    ConfirmDialog,
    ErrorDialog,
    DownloadWeeksDialog,
    ChangeNumberDialog,
    ChangePartDialog,

    FilterPipe
  ],
  providers: [
    DialogService,
  ],
  entryComponents: [
    NewPrayerDialog,
    NewServantDialog,
    NewElderDialog,
    NewStudentDialog,
    NewBrotherDialog,
    NewReaderDialog,
    UsherDialog,
    AcousticsDialog,
    MicOperatorDialog,
    ConfirmDialog,
    ErrorDialog,
    DownloadWeeksDialog,
    ChangeNumberDialog,
    ChangePartDialog

  ]
})
export class DialogModule { }
