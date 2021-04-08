import {Component, Input, Output, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {LocalDataSource} from "ng2-smart-table";
import {WeekMeeting} from "../../models/weekMeeting.model";
import {DialogService} from "../../../services/dialog.service";
import {Brother} from "../../models/brother.model";
import {ServantService} from "../../../services/servant.service";
import {ElderService} from "../../../services/elder.service";

import * as moment from 'moment';
import {MeetingService} from "../../../services/meeting.service";

@Component({
  selector: 'week-temp',
  templateUrl: './week-temp.component.html',
  styleUrls: ['./week-temp.component.scss']
})
export class WeekTempComponent{

  @Input() week: WeekMeeting ;
  @Input() edit: boolean;

  public PART_TYPE = ['initialCall', 'returnVisit', 'bibleStudy'];
  public PART_TYPE_ALL = ['bibleReading', 'initialCall', 'returnVisit', 'bibleStudy'];
  public PART_SCHOOLS = ['primarySchool', 'secondarySchool'];

  public servantList: Array<Brother>;
  public servantListFiltered: Array<Brother> ;
  public elderList: Array<Brother>;
  public elderListFiltered: Array<Brother>;

  public snackBarConfig : MatSnackBarConfig = new MatSnackBarConfig();

  public loading: boolean = false;
  public edited: boolean = false;

  public constructor(private dialogService: DialogService,
                     private servantService:ServantService,
                     private elderService:ElderService,
                      private meetingService: MeetingService,
                      private snackBar: MatSnackBar) {

    this.snackBarConfig.duration = 3000;
  }

  changePart(part, t){
    if(!this.servantList || !this.elderList){
      this.servantService.get().subscribe(brothers => {
        this.servantList = brothers ;
        this.servantListFiltered = brothers.filter(brother => brother.servant[t+"Enabled"]);
        this.elderService.get().subscribe(brothers => {
          this.elderList = brothers ;
          this.elderListFiltered = brothers.filter(brother => brother.elder[t+"Enabled"]);
          this.openDialog(part, t);
        })
      })
    }else{
      this.openDialog(part, t);
    }

  }

  openDialog(part, t){
    this.servantListFiltered = this.servantList.filter(brother => brother.servant[t+"Enabled"]);
    this.elderListFiltered = this.elderList.filter(brother => brother.elder[t+"Enabled"]);
    let list = this.servantListFiltered.concat(this.elderListFiltered);
    list = list.sort((a:any,b:any) => {
      let objA : any = a.elder || a.servant;
      let objB : any = b.elder || b.servant;
      return (moment(objA[t+'Date']).isBefore(objB[t+'Date']) ? -1 : 1)})
    this.dialogService.openChangePart(part, list, t)
        .subscribe(newBrother =>{
          if(newBrother != null){
            part.brother = newBrother;
            this.edited = true;
          }
        });
  }

  editMeeting(){
    this.dialogService.confirm("Confermi l'aggiornamento?").subscribe(confirm => {
      if(confirm){
        this.loading = true;
        this.meetingService.updateMeetingTemp(this.week._id, this.week).subscribe(res => {
          this.snackBar.open("Settimana aggiornata", null, this.snackBarConfig);
          this.meetingService.getMeetingTemp(this.week._id).subscribe(week=> {
            this.week = week;
            this.loading = false;
          })
        },res =>{
          this.loading = false;
          this.snackBar.open("Errore nell'aggiornamento", null, this.snackBarConfig)
        })
      }
    });
  }

}

