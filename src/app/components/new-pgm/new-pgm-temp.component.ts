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
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/models/user.model";

@Component({
  selector: 'new-pgm-temp',
  templateUrl: './new-pgm-temp.component.html',
  styleUrls: ['./new-pgm-config.component.scss']
})
export class NewPgmTempComponent {

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
  public presentationExerciseList: Array<Brother> = [];
  public christianLivingPartBrotherFiltered: Array<Brother> = [];
  public presentationExerciseListFiltered: Array<Brother> = [];

  constructor(private router:Router,
              private meetingService:MeetingService,
              private wtjService:WTJService,
              private newPgmService: NewPgmService,
              private elderService:ElderService,
              private servantService:ServantService,
              private dialogService:DialogService,
              private authService: AuthService) {
    let currentDate = moment();
    let allMonths = moment.months();

    let arrMonths = [];
    arrMonths.push({date: moment(currentDate), month: allMonths[moment(currentDate).month()], year: moment(currentDate).year()});
    // let date = moment(currentDate.add(-1, 'M'));
    // arrMonths.push({date: date, month: allMonths[date.month()], year: date.year()});
    for(var i = 1; i< 6; i++){
      let date = moment(currentDate.add(1, 'M'));
      arrMonths.push({date: date, month: allMonths[date.month()], year: date.year()});
    }
    let newArrMonths = [];
    let newArrMonthsTemp = [];
    meetingService.get().subscribe(weeks => {
      meetingService.getTemp().subscribe(weeksTemp => {
        for (let month of arrMonths) {
          let find = false;
          for (let week of weeks) {
            let date = week.date.clone().day(1);
            if (allMonths[date.month()] == month.month && date.year() == month.year) {
              find = true;
              break;
            }
          }
          if (!find)
            newArrMonths.push(month);
        }

        for (let month of newArrMonths) {
          let find = false;
          for (let week of weeksTemp) {
            let date = week.date.clone().day(1);
            if (allMonths[date.month()] == month.month && date.year() == month.year) {
              find = true;
              break;
            }
          }
          if (!find)
            newArrMonthsTemp.push(month);
        }

        this.arrMonths = newArrMonthsTemp;
      })

    })




  }

  public findWeeks(selectedMonth: any){
    this.loadingMeetingWorkbooks = true;
    this.weeks = [];
    let dateArr = [];
    let date = moment(selectedMonth.date);
    let ms = selectedMonth.date.month();
    // selectedMonth.date.startOf('week').isoWeekday(1);
    var monday = selectedMonth.date
      .startOf('month')
      .day(1)
    if (monday.date() > 7) monday.add(7,'d');
    var month = monday.month();
    let user: User = this.authService.getUser();
    while(month === monday.month()){
      dateArr.push(moment(monday).add(user.congregation.meetingDay, 'd'));
      monday.add(7,'d');
    }


    // for(let i = 1; i <= 31; i++){
    //   date = date.date(i);
    //
    //   if(date.day() == 1){
    //     dateArr.push(moment(date).add(2, 'd'));
    //   }
    // }
    this.wtjService.getMeetingWorkbooks(dateArr).subscribe(weeksMeetingWorkbook => {
      if(weeksMeetingWorkbook){
        for(let i=0; i<dateArr.length; i++){
          for(let j=0; j<weeksMeetingWorkbook.length; j++){
            let weekMeetingWorkbook = weeksMeetingWorkbook[j];
            if(dateArr[i].unix()==weekMeetingWorkbook.date.unix()){
              let model = new WeekMeeting();
              model.date = moment(dateArr[i]);
              model.initialSong = weekMeetingWorkbook.initialSong;
              model.finalSong = weekMeetingWorkbook.finalSong;
              model.intervalSong = weekMeetingWorkbook.intervalSong;
              model.congregationBibleStudy.label = weekMeetingWorkbook.congregationBibleStudy;
              for (let part of weekMeetingWorkbook.christianLivingPart){
                model.christianLivingPart.push({
                  label: part,
                  brother: null
                })
              }
              model.talk.label = weekMeetingWorkbook.talk;
              model.gems.label = weekMeetingWorkbook.gems;
              if(weekMeetingWorkbook.presentationExercise){
                model.type = this.weekType.EXERCISE;
                model.secondarySchool = false;
                model.presentationExercise.label = weekMeetingWorkbook.presentationExercise;
                model.presentationExercise.enabled = true;
                model.bibleReading.label = weekMeetingWorkbook.bibleReading;
              }else{
                model.type = this.weekType.STANDARD;
                model.bibleReading.label = weekMeetingWorkbook.bibleReading;
                model.initialCall.label = weekMeetingWorkbook.initialCall;
                model.returnVisit.label = weekMeetingWorkbook.returnVisit;
                model.bibleStudy.label = weekMeetingWorkbook.bibleStudy;
                model.bibleStudy.primarySchool.isTalk = weekMeetingWorkbook.isTalk;
                model.bibleStudy.primarySchool.gender = weekMeetingWorkbook.isTalk ? 'M' : '';
                model.bibleStudy.secondarySchool.isTalk = weekMeetingWorkbook.isTalk;
                model.bibleStudy.secondarySchool.gender = weekMeetingWorkbook.isTalk ? 'M' : '';
              }

              this.weeks.push(model)
            }
          }
        }
        let obsArr = [
          this.elderService.get(),
          this.servantService.get()
        ];
        Observable.forkJoin(obsArr).subscribe(res => {
          let list = res[0].concat(res[1]);
          list = list.sort((a:any,b:any) => {
            let objA : any = a.elder || a.servant;
            let objB : any = b.elder || b.servant;
            return (moment(objA.christianLivingPartDate).isBefore(objB.christianLivingPartDate) ? -1 : 1)})
          list = list.filter(brother => {
            if(brother.servant) return brother.servant.christianLivingPartEnabled
            if(brother.elder) return brother.elder.christianLivingPartEnabled
          })
          this.christianLivingPartBrother = list;
          this.christianLivingPartBrotherFiltered = [].concat(list);

          let list2 = res[0].concat(res[1]);
          list2 = list2.sort((a:any,b:any) => {
            let objA : any = a.elder || a.servant;
            let objB : any = b.elder || b.servant;
            return (moment(objA.presentationExerciseDate).isBefore(objB.presentationExerciseDate) ? -1 : 1)})
          list2 = list2.filter(brother => {
            if(brother.servant) return brother.servant.presentationExerciseEnabled
            if(brother.elder) return brother.elder.presentationExerciseEnabled
          })

          this.presentationExerciseList = list2
          this.presentationExerciseListFiltered = [].concat(list2)
          this.loadingMeetingWorkbooks = false;
        });
      }else{
        this.loadingMeetingWorkbooks = false;
        this.dialogService.showError("Programma non ancora presente sul sito wol.jw.org")
      }
    })

  }

  public resetFilter(){
    this.christianLivingPartBrotherFiltered = [].concat(this.christianLivingPartBrother);
  }

  public changeDate(week){
    if(week.supervisor){
      week.secondarySchool = false;
      week.date.day(2)
    }else{
      week.secondarySchool = false;
      week.date.day(2)
    }
  }

  // public checkPresentationExercise(b: Brother, week:WeekMeeting){
  //   for(let brother of this.christianLivingPartBrother){
  //     if(week.presentationExercise.enabled && brother.elder && brother.elder.serviceOverseer && b._id == brother._id){
  //       this.dialogService.showError("Attenzione! Il fratello "+brother.name+" "+brother.surname+" è già impegnato nella parte Esercitiamoci per questa settimana. Se si conferma il fratello effettuerà due parti nella stessa adunanza.")
  //     }
  //   }
  // }

  public confirm(){

    this.dialogService.confirm("Confermi la creazione del programma?").subscribe(confirm => {if(confirm) this.complete.emit(this.weeks);});
  }

  filterBrother(ev){
    if(typeof ev == "string"){
      this.christianLivingPartBrotherFiltered = this.christianLivingPartBrother.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
    }
  }

  filterPresentationExercise(ev){
    if(typeof ev == "string"){
      this.presentationExerciseListFiltered = this.presentationExerciseList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
    }
  }

  resetFilterPresentationExercise(){
    this.presentationExerciseListFiltered = [].concat(this.presentationExerciseList)
  }


}
