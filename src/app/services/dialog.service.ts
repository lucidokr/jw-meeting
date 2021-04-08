/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {Prayer} from "../shared/models/prayer.model";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
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
import {ChangePartDialog} from "../shared/components/changePart.component";


@Injectable()
export class DialogService {
  constructor(
    private dialog: MatDialog
  ) {
  }

  public confirm(message:string): Observable<Servant> {

    let dialogRef: MatDialogRef<ConfirmDialog>;

    dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public showError(message: string): Observable<any> {

    let dialogRef: MatDialogRef<ErrorDialog>;

    dialogRef = this.dialog.open(ErrorDialog);
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public openPrayer(brother:Brother, edit:boolean): Observable<Prayer> {

    let dialogRef: MatDialogRef<NewPrayerDialog>;

    dialogRef = this.dialog.open(NewPrayerDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openServant(brother:Brother, edit:boolean): Observable<Servant> {

    let dialogRef: MatDialogRef<NewServantDialog>;

    dialogRef = this.dialog.open(NewServantDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openStudent(brother:Brother, edit:boolean): Observable<Student> {

    let dialogRef: MatDialogRef<NewStudentDialog>;

    dialogRef = this.dialog.open(NewStudentDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openElder(brother:Brother, edit:boolean): Observable<Brother> {

    let dialogRef: MatDialogRef<NewElderDialog>;

    dialogRef = this.dialog.open(NewElderDialog);
    dialogRef.componentInstance.brother = brother;
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openBrother(brother:Brother, edit:boolean): Observable<Brother> {

    let dialogRef: MatDialogRef<NewBrotherDialog>;

    dialogRef = this.dialog.open(NewBrotherDialog);
    dialogRef.componentInstance.brother = brother || new Brother();
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openReader(brother:Brother, edit:boolean): Observable<Brother> {

    let dialogRef: MatDialogRef<NewReaderDialog>;

    dialogRef = this.dialog.open(NewReaderDialog);
    dialogRef.componentInstance.brother = brother || new Brother();
    dialogRef.componentInstance.edit = edit;

    return dialogRef.afterClosed();
  }

  public openDownloadWeeksDialog(weeks: Array<WeekMeeting>, fromCreate: Boolean, format: string): Observable<void>{
    let dialogRef: MatDialogRef<DownloadWeeksDialog>;

    dialogRef = this.dialog.open(DownloadWeeksDialog);
    dialogRef.componentInstance.weeks = weeks;
    dialogRef.componentInstance.fromCreate = fromCreate;
    dialogRef.componentInstance.format = format;

    return dialogRef.afterClosed();
  }

  public openChangePart(part: any, list: Array<Brother>, t: string): Observable<void>{
    let dialogRef: MatDialogRef<ChangePartDialog>;

    dialogRef = this.dialog.open(ChangePartDialog);
    dialogRef.componentInstance.part = part;
    dialogRef.componentInstance.t = t;
    dialogRef.componentInstance.list = list;

    return dialogRef.afterClosed();
  }





}
