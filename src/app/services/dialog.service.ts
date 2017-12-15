/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {environment} from "../../environments/environment";
import {Prayer} from "../shared/models/prayer.model";
import {MdDialog, MdDialogRef} from "@angular/material";
import {NewPrayerDialog} from "../components/prayer/new/new-prayer";
import {Servant} from "../shared/models/servant.model";
import {NewServantDialog} from "../components/servant/new/new-servant";
import {ConfirmDialog} from "../shared/components/confirm.component";
import {Elder} from "../shared/models/elder.model";
import {NewElderDialog} from "../components/elder/new/new-elder";
import {NewStudentDialog} from "../components/student/new/new-student.component";
import {Student} from "../shared/models/student.model";
import {ErrorDialog} from "../shared/components/error.component";
import {Brother} from "../shared/models/brother.model";
import {NewBrotherDialog} from "../components/brother/new/new-brother";
import {NewReaderDialog} from "../components/reader/new/new-reader";
import {WeekMeeting} from "../shared/models/weekMeeting.model";
import {DownloadWeeksDialog} from "../shared/components/downloadWeeks.component";
import {StudyNumber} from "../shared/models/studyNumber.model";
import {ChangeNumberDialog} from "../shared/components/changeNumber.component";
import {ChangePartDialog} from "../shared/components/changePart.component";
import {Usher} from "../shared/models/usher.model";
import {MicOperator} from "../shared/models/mic-operator.model";
import {Acoustics} from "../shared/models/acoustics.model";
import {AcousticsDialog} from "../components/acoustics/new/new-acoustics";
import {MicOperatorDialog} from "../components/mic-operator/new/new-mic-operator";
import {UsherDialog} from "../components/usher/new/new-usher";


@Injectable()
export class DialogService {
  constructor(
    private dialog: MdDialog
  ) {
  }

  public confirm(message:string): Observable<Servant> {

    let dialogRef: MdDialogRef<ConfirmDialog>;

    dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public showError(message: string): Observable<any> {

    let dialogRef: MdDialogRef<ErrorDialog>;

    dialogRef = this.dialog.open(ErrorDialog);
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public openPrayer(brother:Brother, edit:boolean): Observable<Prayer> {

    let dialogRef: MdDialogRef<NewPrayerDialog>;

    dialogRef = this.dialog.open(NewPrayerDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openServant(brother:Brother, edit:boolean): Observable<Servant> {

    let dialogRef: MdDialogRef<NewServantDialog>;

    dialogRef = this.dialog.open(NewServantDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openStudent(brother:Brother, edit:boolean): Observable<Student> {

    let dialogRef: MdDialogRef<NewStudentDialog>;

    dialogRef = this.dialog.open(NewStudentDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openElder(brother:Brother, edit:boolean): Observable<Brother> {

    let dialogRef: MdDialogRef<NewElderDialog>;

    dialogRef = this.dialog.open(NewElderDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openBrother(brother:Brother, edit:boolean): Observable<Brother> {

    let dialogRef: MdDialogRef<NewBrotherDialog>;

    dialogRef = this.dialog.open(NewBrotherDialog);
    dialogRef.componentInstance.brother = brother || new Brother();
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openReader(brother:Brother, edit:boolean): Observable<Brother> {

    let dialogRef: MdDialogRef<NewReaderDialog>;

    dialogRef = this.dialog.open(NewReaderDialog);
    dialogRef.componentInstance.brother = brother || new Brother();
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openDownloadWeeksDialog(weeks: Array<WeekMeeting>, fromCreate: Boolean, format: string): Observable<void>{
    let dialogRef: MdDialogRef<DownloadWeeksDialog>;

    dialogRef = this.dialog.open(DownloadWeeksDialog);
    dialogRef.componentInstance.weeks = weeks;
    dialogRef.componentInstance.fromCreate = fromCreate;
    dialogRef.componentInstance.format = format;

    return dialogRef.afterClosed();
  }

  public openChangePoint(point: StudyNumber, forBibleReading:boolean): Observable<void>{
    let dialogRef: MdDialogRef<ChangeNumberDialog>;

    dialogRef = this.dialog.open(ChangeNumberDialog);
    dialogRef.componentInstance.point = point;
    dialogRef.componentInstance.forBibleReading = forBibleReading;

    return dialogRef.afterClosed();
  }

  public openChangePart(part: any, list: Array<Brother>, t: string): Observable<void>{
    let dialogRef: MdDialogRef<ChangePartDialog>;

    dialogRef = this.dialog.open(ChangePartDialog);
    dialogRef.componentInstance.part = part;
    dialogRef.componentInstance.t = t;
    dialogRef.componentInstance.list = list;

    return dialogRef.afterClosed();
  }

  public openUsher(brother:Brother, edit:boolean): Observable<Usher> {

    let dialogRef: MdDialogRef<UsherDialog>;

    dialogRef = this.dialog.open(UsherDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openMicOperator(brother:Brother, edit:boolean): Observable<MicOperator> {

    let dialogRef: MdDialogRef<MicOperatorDialog>;

    dialogRef = this.dialog.open(MicOperatorDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openAcoustics(brother:Brother, edit:boolean): Observable<Acoustics> {

    let dialogRef: MdDialogRef<AcousticsDialog>;

    dialogRef = this.dialog.open(AcousticsDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }





}
