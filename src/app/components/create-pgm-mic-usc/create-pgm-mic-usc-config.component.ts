import {Component, Output, EventEmitter} from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../../services/student.service";
import * as moment from 'moment';
import {WTJService} from "../../services/wtj.service";
import {WeekMeeting} from "../../shared/models/weekMeeting.model";
import {EmitterService} from "../../services/emitter.service";
import {NewPgmService} from "../../services/new-pgm.service";
import {Observable} from "rxjs";
import {Brother} from "../../shared/models/brother.model";
import {ElderService} from "../../services/elder.service";
import {ServantService} from "../../services/servant.service";
import {DialogService} from "../../services/dialog.service";
import {MeetingService} from "../../services/meeting.service";

@Component({
  selector: 'new-pgm-config',
  templateUrl: './new-pgm-config.component.html',
  styleUrls: ['./new-pgm-config.component.scss']
})
export class NewPgmConfigComponent {

  @Output() complete: EventEmitter<Array<WeekMeeting>> = new EventEmitter<Array<WeekMeeting>>();

  public arrMonths: any = moment.months();
  public weekNumber : number;
  public weeks : Array<WeekMeeting> = [];
  public weekType : any = {
    'STANDARD': {id:0, label:"Adunanza normale", meeting:true, disableSchool:false, withSupervisor:true},
    'EXERCISE': {id:1, label:"Adunanza con video Esercitiamoci", meeting:true, disableSchool:true, withSupervisor:true},
    'SPECIAL_MEETING': {id:2, label:"Assemblea speciale di un giorno", meeting:false, disableSchool:false, withSupervisor:false},
    'CONGRESS': {id:3, label:"Congresso di zona", meeting:false, disableSchool:false, withSupervisor:false},
  };
  public loadingMeetingWorkbooks: boolean = false;
  public christianLivingPartBrother: Array<Brother> = [];
  public christianLivingPartBrotherFiltered: Array<Brother> = [];

  constructor(private router:Router, private meetingService:MeetingService, private wtjService:WTJService, private newPgmService: NewPgmService, private elderService:ElderService, private servantService:ServantService, private dialogService:DialogService) {
    let arrMonths = [];
    let allMonths = moment.months();
    meetingService.getTemp().subscribe(weeksTemp => {
      meetingService.get().subscribe(weeks => {
        for(let tempWeek of weeksTemp){
          let find = false;
          let dt = tempWeek.date.clone().day(1);
          for(let week of weeks){
            let dw = week.date.clone().day(1);
            if(dt.date() == dw.date() && dt.month() == dw.month() && dt.year() == dw.year())
              find = true

          }
          if(!find){
            let findArr = false;
            for(let arr of arrMonths){
              if(arr.date.month() == dt.month() && arr.date.year() == dt.year()){
                arr.weeks.push(tempWeek)
                findArr = true;
              }
            }
            if(!findArr)
              arrMonths.push({weeks:[tempWeek], date: moment(dt), month: allMonths[moment(dt).month()], year: moment(dt).year()})
          }
        }

        this.arrMonths = arrMonths;
      })
    })

  }

  public findWeeks(selectedMonth: any){
    this.weeks = selectedMonth.weeks;
  }

  public confirm(){
    this.complete.emit(this.weeks);
  }
  //
  // filterBrother(ev){
  //   if(typeof ev == "string"){
  //     this.christianLivingPartBrotherFiltered = this.christianLivingPartBrother.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  //   }
  // }


}
