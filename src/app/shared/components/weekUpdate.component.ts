import {Component, Input, Output, EventEmitter, OnChanges, SimpleChange, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {DialogService} from "../../services/dialog.service";
import {LocalDataSource} from "ng2-smart-table";
import {WeekMeeting} from "../models/weekMeeting.model";
import {Brother} from "../models/brother.model";
import {MeetingService} from "../../services/meeting.service";
import {StudyNumber} from "../models/studyNumber.model";
import {StudyNumberService} from "../../services/study-number.service";
import {CONST, CONST_ARR} from "../../constant";

@Component({
  selector: 'week--update',
  templateUrl: './weekUpdate.component.html',
  styles:['md-select { width:100% }','.updated,.notUpdated{width:100%}','.updated strong{padding-left:30px;}','.containerSchoolPart{width:100%}','.updated .material-icons{ margin-top:-2px;margin-left:-30px; position: absolute;color: green;}']

})
export class WeekUpdateComponent implements OnInit{

  @Input() week: WeekMeeting ;
  @Input() fromHome: boolean ;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  public loading: boolean;
  public CONST = CONST;
  public PART_TYPE = CONST_ARR.PART_TYPE;
  public SCHOOLS = CONST_ARR.SCHOOLS;
  public snackBarConfig : MdSnackBarConfig = new MdSnackBarConfig();

  public constructor(private meetingService: MeetingService, private snackBar:MdSnackBar, private studyNumberService: StudyNumberService, private dialogService:DialogService) {


  }

  ngOnInit(){
    if(!this.week.secondarySchool){
      this.SCHOOLS = [CONST.PRIMARY_SCHOOL];
    }
    this.snackBarConfig.duration = 3000;
  }

  public confirm(){

    this.dialogService.confirm("Confermi l'aggiornamento?").subscribe(confirm => {
      if(confirm){
        this.loading = true;
        this.meetingService.updateMeeting(this.week._id, this.week).subscribe(res => {
          this.snackBar.open("Settimana aggiornata", null, this.snackBarConfig);
          this.meetingService.getMeeting(this.week._id).subscribe(week=> {
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

