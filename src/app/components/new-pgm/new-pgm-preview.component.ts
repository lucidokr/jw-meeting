import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../../services/student.service";
import * as moment from 'moment';
import { Observable } from 'rxjs';

import "rxjs/add/operator/timeout";
import {WeekMeeting} from "../../shared/models/weekMeeting.model";
import {EmitterService} from "../../services/emitter.service";
import {ServantService} from "../../services/servant.service";
import {PrayerService} from "../../services/prayer.service";
import {ElderService} from "../../services/elder.service";
import {Servant} from "../../shared/models/servant.model";
import {Elder} from "../../shared/models/elder.model";
import {Student} from "../../shared/models/student.model";
import {Prayer} from "../../shared/models/prayer.model";
import {Brother} from "../../shared/models/brother.model";
import {DialogService} from "../../services/dialog.service";
import {NewPgmService} from "../../services/new-pgm.service";
import {ReaderService} from "../../services/reader.service";
import {MeetingService} from "../../services/meeting.service";
import {CONST, CONST_ARR} from "../../constant";

@Component({
  selector: 'new-pgm-preview',
  templateUrl: './new-pgm-preview.component.html',
  styleUrls: ['./new-pgm-preview.component.scss']
})
export class NewPgmPreviewComponent implements OnInit{

  @Input() weeks:Array<WeekMeeting>;
  @Output() back: EventEmitter<any> = new EventEmitter<any>();

  public loading : Boolean = true;
  public interval;
  public loadingInsertPgm : Boolean = false;
  public changeMode : any = {
    busyError:false,
    week: null,
    list:null,
    busyList:null,
    brotherToChange:null,
    enabled:false,
  };
  public busyErrorBrother: Array<Brother> = [];
  public PART_TYPE = ['initialCall', 'returnVisit', 'bibleStudy'];
  public PART_TYPE_ALL = ['bibleReading', 'initialCall', 'returnVisit', 'bibleStudy'];

  public prayerList : Array<Brother> = [];
  public prayerListAll : Array<Brother> = [];
  public gemsList : Array<any> = [];
  public gemsListAll : Array<any> = [];
  public talkList : Array<any> = [];
  public talkListAll : Array<any> = [];
  public presidentList : Array<any> = [];
  public presidentListAll : Array<any> = [];
  public servantList : Array<Brother> = [];
  public servantListAll : Array<Brother> = [];
  public elderList : Array<Brother> = [];
  public elderListFiltered : Array<Brother> = [];
  public congregationBibleStudyList : Array<Brother> = [];
  public elderListAll : Array<Brother> = [];
  public studentList : Array<Brother> = [];
  public studentListAll : Array<Brother> = [];
  public readerList : Array<Brother> = [];
  public readerListAll : Array<Brother> = [];
  public studentListBusy : Array<Brother> = [];
  public bibleReadingList : Array<Brother> = [];
  public bibleReadingListPrimarySchool : Array<Brother> = [];
  public bibleReadingListSecondarySchool : Array<Brother> = [];
  public initialCallListPrimarySchool : Array<Brother> = [];
  public initialCallListSecondarySchool : Array<Brother> = [];
  public returnVisitListPrimarySchool : Array<Brother> = [];
  public returnVisitListSecondarySchool : Array<Brother> = [];
  public bibleStudyListPrimarySchool : Array<Brother> = [];
  public bibleStudyListSecondarySchool : Array<Brother> = [];
  public biblereadingListAll : Array<Brother> = [];
  public assistantList : Array<Brother> = [];
  public assistantListAll : Array<Brother> = [];

  constructor(private router:Router,
              private prayerService:PrayerService,
              private elderService:ElderService,
              private studentService:StudentService,
              private servantService:ServantService,
              private readerService:ReaderService,
              private meetingService:MeetingService,
              private emitterService:EmitterService,
              private dialogService:DialogService,
              private newPgmService:NewPgmService) {

    this.emitterService.get("change_header_subtitle")
      .emit('Nuovo programma');
  }

  ngOnInit(){
    this.loading = true;
    let arr = [
      this.prayerService.get().map(json => {return {type:'prayer', data:json}}),
      this.elderService.get().map(json => {return {type:'elder', data:json}}),
      this.servantService.get().map(json => {return {type:'servant', data:json}}),
      this.studentService.get().map(json => {return {type:'student', data:json}}),
      this.readerService.get().map(json => {return {type:'reader', data:json}})
    ];
    Observable.forkJoin(arr)
      .subscribe((res:any)=> {
        this.meetingService.get().subscribe(meetings => {
          this.sortAndFind(res, meetings)
        })

      })
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

  createIntervalSave(){
    let that = this;
    this.interval = setInterval(function(){
      localStorage["weeks_"+that.weeks[0].date.month()+"_"+that.weeks[0].date.year()] = JSON.stringify(that.weeks);
    },15000)
  }

  sortAndFind(res:any, meetings:any){
    meetings = meetings.sort((a:any,b:any) => {return (moment(a.date).isBefore(b.date) ? 1 : -1)});
    for(let r of res ){
      this[r.type+"List"] = this[r.type+"List"].concat(r.data);
      this[r.type+"ListAll"] = this[r.type+"ListAll"].concat(r.data);
    }
    this.prayerList = this.prayerList.sort((a:Brother,b:Brother) => {return (moment(a.prayer.date).isBefore(b.prayer.date) ? -1 : 1)});
    this.readerList = this.readerList.sort((a:Brother,b:Brother) => {return (moment(a.reader.date).isBefore(b.reader.date) ? -1 : 1)});
    // let elderAndServantList = [].concat(this.elderList, this.servantList);
    this.gemsList = [].concat(this.elderList, this.servantList).sort((a:any,b:any) => {
      let objA : any = a.elder || a.servant;
      let objB : any = b.elder || b.servant;
      return (moment(objA.gemsDate).isBefore(objB.gemsDate) ? -1 : 1)});
    this.talkList = [].concat(this.elderList, this.servantList).sort((a:any,b:any) => {
      let objA : any = a.elder || a.servant;
      let objB : any = b.elder || b.servant;
      return (moment(objA.talkDate).isBefore(objB.talkDate) ? -1 : 1)});
    this.presidentList = [].concat(this.elderList).sort((a:Brother,b:Brother) => {return (moment(a.elder.presidentDate).isBefore(b.elder.presidentDate) ? -1 : 1)});
    this.congregationBibleStudyList = [].concat(this.elderList).sort((a:Brother,b:Brother) => {return (moment(a.elder.bibleStudyDate).isBefore(b.elder.bibleStudyDate) ? -1 : 1)});
    // this.assistantList = [].concat(this.studentList).sort((a:Brother,b:Brother) => {return (moment(a.student.assistantDate).isBefore(b.student.assistantDate) ? -1 : 1)});
    this.studentList = [].concat(this.studentList).sort((a:Brother,b:Brother) => {return (moment(a.student.lastDate).isBefore(b.student.lastDate) ? -1 : 1)});
    this.bibleReadingList = [].concat(this.studentList).sort((a:Brother,b:Brother) => {return (moment(a.student.bibleReadingDate).isBefore(b.student.bibleReadingDate) ? -1 : 1)});
    let countSchoolOverseer = 0;
    let schoolOverseer;
    for(let i = 0; i < this.elderList.length; i++){
      if(this.elderList[i].elder.schoolOverseer){
        schoolOverseer = this.elderList[i];
      }
    }
    if(schoolOverseer.elder.schoolOverseer){
      for (let meeting of meetings){
        if(meeting.type.meeting && meeting.president && meeting.president != schoolOverseer._id){
          countSchoolOverseer++;
        }
        if(meeting.type.meeting && meeting.president && meeting.president === schoolOverseer._id){
          break;
        }
      }
    } else {
      this.dialogService.showError("Manca il presidente della scuola. Configuralo nella lista degli anziani.")
    }
    for(let week of this.weeks){

      if(week.type.meeting && !week.supervisor){
        let arrChristianLivingPartBrother = [];
        for (let part of week.christianLivingPart){
          if(!part.president)
            arrChristianLivingPartBrother.push(part.brother._id);
        }

        /**PRESIDENT**/
        // if(!week.president){
        if(countSchoolOverseer >= 2 && arrChristianLivingPartBrother.indexOf(schoolOverseer._id) == -1 && schoolOverseer.elder.presidentEnabled){
          week.president = schoolOverseer;
          countSchoolOverseer = 0;
        }else{
          countSchoolOverseer++;
          let presidentList = this.presidentList.filter(brother =>
                  arrChristianLivingPartBrother.indexOf(brother._id) == -1 &&
                  brother.elder.presidentEnabled);
          week.president = {...presidentList[0]};
        }
        for (let part of week.christianLivingPart){
          if(part.president){
            part.brother = week.president
            arrChristianLivingPartBrother.push(part.brother._id);
          }
        }
        this.presidentList = this.presidentList.filter(brother => brother._id != week.president._id);
        this.presidentList.push(week.president);

        /**CONGREGATION BIBLE STUDY**/
        let congregationBibleStudyList = this.congregationBibleStudyList.filter(brother =>
          arrChristianLivingPartBrother.indexOf(brother._id) == -1 &&
          brother._id != week.president._id &&
          brother.elder.bibleStudyEnabled);
        week.congregationBibleStudy.brother = {...congregationBibleStudyList[0]};
        this.congregationBibleStudyList = this.congregationBibleStudyList.filter(brother => brother._id != week.congregationBibleStudy.brother._id);
        this.congregationBibleStudyList.push(week.congregationBibleStudy.brother);

        /**TALK
         * Controlli da fare: se è abilitato, e se è uguale al presidente
         * **/
        let talkList = this.talkList.filter(brother =>
                    arrChristianLivingPartBrother.indexOf(brother._id) == -1 &&
                    (brother.elder && brother.elder.talkEnabled || brother.servant && brother.servant.talkEnabled)
                    && brother._id != week.congregationBibleStudy.brother._id
                    && brother._id != week.president._id)
        week.talk.brother = {...talkList[0]};
        this.talkList = this.talkList.filter(brother => brother._id != week.talk.brother._id);
        this.talkList.push(week.talk.brother);

        /**GEMS
         * Controlli da fare: se è abilitato, se è uguale al presidente, se è uguale al discorso
         * **/
        let gemsList = this.gemsList.filter(brother =>
                    arrChristianLivingPartBrother.indexOf(brother._id) == -1 &&
                    (brother.elder && brother.elder.gemsEnabled || brother.servant && brother.servant.gemsEnabled)
                    && brother._id != week.congregationBibleStudy.brother._id
                    && brother._id != week.president._id
                    && brother._id != week.talk.brother._id)
        week.gems.brother = {...gemsList[0]};
        this.gemsList = this.gemsList.filter(brother => brother._id != week.gems.brother._id);
        this.gemsList.push(week.gems.brother);

        /**SECOND IMPLEMENTATION**/

        // let studentList = this.studentList.filter(brother =>
        // arrChristianLivingPartBrother.indexOf(brother._id) == -1 &&
        // brother._id != week.talk.brother._id
        // && brother._id != week.gems.brother._id);
        //
        // let find = function(list, partTypeList, forced){
        //   // filtro la lista degli studenti
        //   for(let brother of list){
        //     let dates = [];
        //     // controllo per quali parti il fratello può essere inserito e da quanto non fa una determinata parte
        //     for(let partType of partTypeList) {
        //       //se è un discorso faccio un controllo speciale per verificare se è abilitato
        //       let partEnabled = brother.student[partType + "Enabled"];
        //       if(week[partType].primarySchool.isTalk){
        //         partEnabled = brother.student.talkEnabled;
        //       }
        //       if (partEnabled) {
        //         // Nell'array dates ci saranno le parti per il quale il fratello non fa da più tempo discorsi
        //         // La lettura della bibbia viene fatta solo da uomini, non ha bisogno del controllo sul gender
        //         if(partType!='bibleReading'){
        //           let primarySchool = ((week[partType].primarySchool.gender != '' && brother.gender ==  week[partType].primarySchool.gender) || week[partType].primarySchool.gender == '')
        //           let secondarySchool = ((week[partType].secondarySchool.gender != '' && brother.gender ==  week[partType].secondarySchool.gender) || week[partType].secondarySchool.gender == '')
        //           dates.push({
        //             type: partType,
        //             date: brother.student[partType + "Date"],
        //             primarySchoolEnabled: primarySchool && brother.student.primarySchoolEnabled,
        //             secondarySchoolEnabled: secondarySchool && brother.student.secondarySchoolEnabled
        //           })
        //         }else{
        //           dates.push({
        //             type: partType,
        //             date: brother.student[partType + "Date"],
        //             primarySchoolEnabled: brother.student.primarySchoolEnabled,
        //             secondarySchoolEnabled: brother.student.secondarySchoolEnabled
        //           })
        //         }
        //       }
        //     }
        //     if(dates.length>0){
        //       dates.sort((a:any,b:any) => {return (moment(a.date).isBefore(b.date) ? -1 : 1)});
        //       // se devo forzare il completamento della settimana mi ciclo tutto le parti ordinate per data per trovare la migliore
        //       // controllo ovvimaente nache che il fratello sia abilitato a svolgere quella parte
        //       if(forced){
        //         for(let date of dates) {
        //           if(date.primarySchoolEnabled && date.secondarySchoolEnabled){
        //             if(week.secondarySchool && date.secondarySchoolEnabled){
        //               let lastSchoolPart = brother.student[date.type+"LastSchool"];
        //               if(lastSchoolPart == 1 || !date.primarySchoolEnabled){
        //                 if(!week[date.type].secondarySchool.student ){
        //                   week[date.type].secondarySchool.student = brother;
        //                   break;
        //                 }else if(date.primarySchoolEnabled){
        //                   if(!week[date.type].primarySchool.student){
        //                     week[date.type].primarySchool.student = brother;
        //                     break;
        //                   }
        //                 }
        //
        //               }else if(date.primarySchoolEnabled){
        //                 if(!week[date.type].primarySchool.student){
        //                   week[date.type].primarySchool.student = brother;
        //                   break;
        //                 }
        //               }
        //             }else if(date.primarySchoolEnabled){
        //               if(!week[date.type].primarySchool.student){
        //                 week[date.type].primarySchool.student = brother;
        //                 break;
        //               }
        //             }
        //           }
        //         }
        //       }else{
        //         // se non devo forzare il completamento della settimana cerco di inserire il fratello
        //         // nella parte che non fa da più tempo e per la scuola diversa dall'ultimo discorso
        //         // controllo ovvimaente nache che il fratello sia abilitato a svolgere quella parte
        //         let date = dates[0];
        //         if(date.primarySchoolEnabled && date.secondarySchoolEnabled) {
        //           if (week.secondarySchool && brother.student.secondarySchoolEnabled) {
        //             let lastSchoolPart = brother.student[date.type + "LastSchool"];
        //             if (lastSchoolPart == 1 || !brother.student.primarySchoolEnabled) {
        //               if (!week[date.type].secondarySchool.student) {
        //                 week[date.type].secondarySchool.student = brother;
        //               }
        //             } else {
        //               if (!week[date.type].primarySchool.student) {
        //                 week[date.type].primarySchool.student = brother;
        //               }
        //             }
        //           } else if (brother.student.primarySchoolEnabled) {
        //             if (!week[date.type].primarySchool.student) {
        //               week[date.type].primarySchool.student = brother;
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
        // //inizio la ricerca della combinazione migliore in base al tipo di settimana
        // let allCompleted;
        // if(week.presentationExercise.enabled){
        //   find(studentList, ['bibleReading'], false);
        //   allCompleted = this.checkWeekCompletedAndRemove(week, ['bibleReading'], 'student')
        // }else{
        //   find(studentList, this.PART_TYPE_ALL, false);
        //   allCompleted = this.checkWeekCompletedAndRemove(week, this.PART_TYPE_ALL, 'student')
        // }
        //
        // // controllo che la ricerca è completata e la settimana è coperta ed elimino gli studenti già inseriti dalla lista
        // if(!allCompleted){
        //   let studentList = this.studentList.filter(brother =>
        //     arrChristianLivingPartBrother.indexOf(brother._id) == -1 &&
        //     brother._id != week.talk.brother._id
        //     && brother._id != week.gems.brother._id);
        //   if(week.presentationExercise.enabled){
        //     find(studentList, ['bibleReading'],true);
        //     this.checkWeekCompletedAndRemove(week, ['bibleReading'], 'student')
        //   }else{
        //     find(studentList, this.PART_TYPE_ALL,true);
        //     this.checkWeekCompletedAndRemove(week, this.PART_TYPE_ALL, 'student')
        //   }
        //
        // }


        /**FIRST IMPLEMENTATION**/

            // /**BIBLE READING
            //  * Controlli da fare: se è abilitato, se è uguale al discorso, se è uguale alle gemme
            //  **/
            // let bibleReadingList = [].concat(this.studentList)
            //   .filter(brother =>
            //           brother.student.bibleReadingEnabled
            //           && brother._id != week.talk.brother._id
            //           && brother._id != week.gems.brother._id)
            //   .sort((a:Brother,b:Brother) => {return (moment(a.student.bibleReadingDate).isBefore(b.student.bibleReadingDate) ? -1 : 1)});
            // this.bibleReadingListPrimarySchool = bibleReadingList.filter(brother => brother.student.primarySchoolEnabled);
            // this.bibleReadingListSecondarySchool = bibleReadingList.filter(brother => brother.student.secondarySchoolEnabled);
            // week.bibleReading.primarySchool.student = {...this.bibleReadingListPrimarySchool[0]};
            // if(week.secondarySchool){
            //   week.bibleReading.secondarySchool.student = {...this.bibleReadingListSecondarySchool[0]};
            //   this.removeFromStudentList([week.bibleReading.primarySchool.student, week.bibleReading.secondarySchool.student]);
            // }else{
            //   this.removeFromStudentList([week.bibleReading.primarySchool.student]);
            // }
            //
            // if(!week.presentationExercise.enabled){
            //   for(let partType of this.PART_TYPE){
            //     let list = [].concat(this.studentList)
            //       .filter(brother =>
            //               brother.student[partType+'Enabled']
            //               && brother._id != week.talk.brother._id
            //               && brother._id != week.gems.brother._id)
            //       .sort((a:Brother,b:Brother) => {return (moment(a.student[partType+"Date"]).isBefore(b.student[partType+"Date"]) ? -1 : 1)})
            //     this[partType+'ListPrimarySchool'] = list.filter(brother =>
            //       brother.student.primarySchoolEnabled
            //       && (week[partType].primarySchool.gender != '' && brother.gender == week[partType].primarySchool.gender || week[partType].primarySchool.gender == '')
            //     );
            //     week[partType].primarySchool.student = {...this[partType+'ListPrimarySchool'][0]};
            //     if(week.secondarySchool){
            //       this[partType+'ListSecondarySchool'] = list.filter(brother =>
            //         brother.student.secondarySchoolEnabled
            //         && (week[partType].secondarySchool.gender != '' && brother.gender == week[partType].secondarySchool.gender || week[partType].secondarySchool.gender == '')
            //       );
            //       week[partType].secondarySchool.student = {...this[partType+'ListSecondarySchool'][1]};
            //       this.removeFromStudentList([week[partType].primarySchool.student, week[partType].secondarySchool.student]);
            //     }else{
            //       this.removeFromStudentList([week[partType].primarySchool.student]);
            //     }
            //   }
            //
            // }
      }

      console.log(this)
    }

    let brotherToIgnore = [];
    /**THIRD IMPLEMENTATION**/

    function putBrother(week, brother, part, forced, bibleReading){
      var strPartType = "";
      if(bibleReading)
        strPartType = "bibleReading"
      else{
        if(part.isTalk){
          strPartType = "talk"
        }else{
          strPartType = "ministryPart"
        }
      }

      // let arrChristianLivingPartBrother = [];
      // for (let part of week.christianLivingPart){
      //   arrChristianLivingPartBrother.push(part.brother._id);
      // }
      // if(arrChristianLivingPartBrother.indexOf(brother._id) == -1 && brother._id != week.talk.brother._id && brother._id != week.gems.brother._id){
      //   let lastSchoolPart = brother.student[part + "LastSchool"];
      //   if(!week[part].primarySchool.student && brother.student.primarySchoolEnabled &&
      //     ((week[part].primarySchool.gender != '' && brother.gender ==  week[part].primarySchool.gender) || week[part].primarySchool.gender == '' || part == CONST.BIBLE_READING)){
      //     if((!week.secondarySchool && !week.presentationExercise.enabled) || lastSchoolPart == 2 || !lastSchoolPart || week[part].secondarySchool.student){
      //       week[part].primarySchool.student = brother;
      //       brotherToIgnore.push(brother._id);
      //       return true;
      //     }
      //   }
      //   if(week.secondarySchool
      //     && !week[part].secondarySchool.student
      //     // && (week[part].primarySchool.student && brother._id != week[part].primarySchool.student._id)
      //     && brother.student.secondarySchoolEnabled
      //     && ((week[part].secondarySchool.gender != '' && brother.gender ==  week[part].secondarySchool.gender) || week[part].secondarySchool.gender == '' || part == CONST.BIBLE_READING)){
      //     if(lastSchoolPart == 1 || !lastSchoolPart || week[part].primarySchool.student){
      //       week[part].secondarySchool.student = brother;
      //       brotherToIgnore.push(brother._id);
      //       return true;
      //     }
      //   }
      // }
      let arrChristianLivingPartBrother = [];
      for (let part of week.christianLivingPart){
        arrChristianLivingPartBrother.push(part.brother._id);
      }
      //filtro per i fratelli che non sono già impegnati in una parte vita cristiana nelle gemme e nei tesori
      if(arrChristianLivingPartBrother.indexOf(brother._id) == -1 && brother._id != week.talk.brother._id && brother._id != week.gems.brother._id){
        let lastSchoolPart = brother.student[strPartType + "LastSchool"];
        if(!part.primarySchool.student && brother.student.primarySchoolEnabled &&
          ((part.primarySchool.gender != '' && brother.gender ==  part.primarySchool.gender) || part.primarySchool.gender == '' || bibleReading)){
          if((!week.secondarySchool) || lastSchoolPart == 2 || forced || !lastSchoolPart){
            part.primarySchool.student = brother;
            brotherToIgnore.push(brother._id);
            return true;
          }
        }
        if(week.secondarySchool
          && !part.secondarySchool.student
          && ((part.primarySchool.student && brother._id != part.primarySchool.student._id) || !part.primarySchool.student)
          && brother.student.secondarySchoolEnabled
          && ((part.secondarySchool.gender != '' && brother.gender ==  part.secondarySchool.gender) || part.secondarySchool.gender == '' || bibleReading)){
          if(lastSchoolPart == 1 || forced || !lastSchoolPart){
            part.secondarySchool.student = brother;
            brotherToIgnore.push(brother._id);
            return true;
          }
        }
      }
      return false;
    }

    let listBibleReading = [].concat(this.studentList)
    .filter(brother => brother.student.bibleReadingEnabled /*&& brother.student.lastDate.isBefore(moment(this.weeks[0].date).add(-15, "d"))*/)
    .sort((a:Brother,b:Brother) => {
      if(!a.student.bibleReadingDate)
        return -1;
      if(a.student.bibleReadingDate.isAfter(b.student.bibleReadingDate))
        return 1;
      if(a.student.bibleReadingDate.isBefore(b.student.bibleReadingDate))
        return -1;
      return 0;
      // return (moment(a.student.lastDate).isBefore(b.student.lastDate) ? -1 : 1)
    });
    for(let brother of listBibleReading) {
      let inserted = false;
      let part = "bibleReading"
      for(let week of this.weeks) {
        if(week.type.meeting
            && !week.supervisor
            && brother.student.lastDate.isBefore(moment(week.date).add(-15, "d"))
            && (!brother.student.bibleReadingLastDate || (brother.student.bibleReadingLastDate && brother.student.bibleReadingLastDate.isBefore(moment(week.date).add(-30, "d"))))
          ){
          inserted = putBrother(week, brother, week.bibleReading, false, true)
          if(inserted)
            break;
        }
      }
    }
    for(let week of this.weeks) {
      this.checkWeekCompletedAndRemove(week, [week.bibleReading], 'student')
    }



    function findAlgorithm(week, part, forced, minLastDate){
        //FILTER AND SORT BY PART
        let list = [].concat(this.studentList)
          .filter(brother => {
            return (
              brotherToIgnore.indexOf(brother._id) == -1
              && (
                !brother.student.lastDate ||
                (brother.student.lastDate && brother.student.lastDate.isBefore(moment(this.weeks[0].date).add(-minLastDate, "d"))) ||
                (brother.student.lastDate == brother.student.bibleReadingLastDate && brother.student.lastDate.isBefore(moment(this.weeks[0].date).add(-(minLastDate/2), "d")))
              )
            )
          })
          .sort((a:Brother,b:Brother) => {
            if(part.isTalk){
              if(!a.student.talkDate)
                return -1;
              if(a.student.talkDate.isAfter(b.student.talkDate))
                return 1;
              if(a.student.talkDate.isBefore(b.student.talkDate))
                return -1;
              return 0;
            }else{
              if(!a.student.ministryPartDate)
                return -1;
              if(a.student.ministryPartDate.isAfter(b.student.ministryPartDate))
                return 1;
              if(a.student.ministryPartDate.isBefore(b.student.ministryPartDate))
                return -1;
              return 0;
            }

              // return (moment(a.student.lastDate).isBefore(b.student.lastDate) ? -1 : 1)
            });

      // for(let week of this.weeks) {
          if(part.forStudent){
            for(let brother of list.filter(brother => brotherToIgnore.indexOf(brother._id) == -1)) {
                if(week.type.meeting && !week.supervisor){
                  let partEnabled = brother.student.ministryPartEnabled;
                  if(part.isTalk){
                    partEnabled = brother.student.talkEnabled;
                  }
                  if(partEnabled){
                    putBrother(week, brother, part, forced, false)

                  }
                }
              }
        // }

      }

    }
    var minLastDate = 60
    let that = this;
    let errorToShow = false;
    function findweekMinistryPart(forced, minLastDate){
      for(let week of that.weeks) {
        for(let part of week.ministryPart){
          findAlgorithm.call(that, week, part, false, minLastDate)
        }
      }
      let weeksCompleted = true;
      for(let week of that.weeks) {
        if(!that.checkWeekCompletedAndRemove(week, week.ministryPart, 'student')){
          weeksCompleted = false;
          errorToShow = true;
        }

      }
      if(!weeksCompleted && minLastDate != 0)
        findweekMinistryPart(!forced, (forced ? minLastDate -30 : minLastDate))
    }

    findweekMinistryPart(false, minLastDate)

    /** ASSISTANT  **/
    for(let week of this.weeks) {
      if(week.type.meeting && !week.supervisor){
        let arrChristianLivingPartBrother = [];
        for (let part of week.christianLivingPart){
          arrChristianLivingPartBrother.push(part.brother._id);
        }
        this.assistantList = [].concat(this.studentList).sort((a:Brother,b:Brother) => {return (moment(a.student.assistantDate).isBefore(b.student.assistantDate) ? -1 : 1)});


        if (week.type.meeting) {
          for (let brother of this.assistantList) {
            if (brother.student.assistantEnabled) {
              for (let part of week.ministryPart) {
                if (!part.isTalk && part.forStudent) {
                  if (part.primarySchool.student && !part.primarySchool.assistant && part.primarySchool.student.gender == brother.gender && brother.student.primarySchoolEnabled) {
                    part.primarySchool.assistant = brother;
                    break;
                  }
                  if (week.secondarySchool && part.secondarySchool.student && !part.secondarySchool.assistant && part.secondarySchool.student.gender == brother.gender && brother.student.secondarySchoolEnabled) {
                    part.secondarySchool.assistant = brother;
                    break;
                  }
                }
              }
            }
          }
          if(!this.checkWeekCompletedAndRemove(week, week.ministryPart, 'assistant')){
            errorToShow = true;
          }
        }

        /** PRAYER  **/
        let prayerList = this.prayerList.filter(brother =>
        arrChristianLivingPartBrother.indexOf(brother._id) == -1 &&
        brother.prayer.enabled
        && brother._id != week.congregationBibleStudy.brother._id
        && brother._id != week.gems.brother._id
        && brother._id != week.talk.brother._id
        && brother._id != week.president._id);

        week.initialPrayer = {...prayerList[0]};
        week.finalPrayer = {...prayerList[1]};
        this.prayerList = this.prayerList.filter(brother => brother._id != week.initialPrayer._id && brother._id != week.finalPrayer._id );
        this.prayerList.push(week.initialPrayer);
        this.prayerList.push(week.finalPrayer);

        let readerList = this.readerList.filter(brother =>
          brother.reader.enabled
          && arrChristianLivingPartBrother.indexOf(brother._id) == -1
          && brother._id != week.congregationBibleStudy.brother._id
          && brother._id != week.initialPrayer._id
          && brother._id != week.finalPrayer._id
          && brother._id != week.gems.brother._id
          && brother._id != week.talk.brother._id
          && brother._id != week.president._id);
        week.congregationBibleStudy.reader = {...readerList[0]};
        this.readerList = this.readerList.filter(brother => brother._id != week.congregationBibleStudy.reader._id);
        this.readerList.push(week.congregationBibleStudy.reader)
      }
    }
    if(errorToShow){
      this.dialogService.showError("Attenzione per alcuni discorsi non sono riuscito a trovare uno studente o assistente disponibile! E' necessaria la modifica manuale.").subscribe(res => {})
    }
    this.loading = false;
    this.createIntervalSave();
  }

  checkWeekCompletedAndRemove(week, parts, type){
    let allCompleted = true;
    let toRemove = [];
    for(let part of parts) {
      if(part.forStudent){
        if(part.primarySchool[type])
          toRemove.push(part.primarySchool[type]);
        if(part.secondarySchool[type])
          toRemove.push(part.secondarySchool[type]);

        if(type != "assistant" || (!part.isTalk && type=="assistant")){
          if(!part.primarySchool[type]){
            allCompleted = false;
            // break;
          }
        }
        if(week.secondarySchool && (type != "assistant" || (!part.isTalk && type=="assistant"))) {
          if (!part.secondarySchool[type]) {
            allCompleted = false;
            // break;
          }
        }
      }

    }
    this.removeFromStudentList(toRemove);
    return allCompleted;
  }

  removeFromStudentList(arr){
    for(let studentToRemove of arr){
      for(let i=0; i<this.studentList.length; i++){
        if(studentToRemove._id == this.studentList[i]._id){
          let list = this.studentList.splice(i, 1);
          this.studentListBusy.push(list[0]);
          // this.studentList.push(list[0]);
          break;
        }
      }
    }
  }

  change(obj:any){
    let week = obj.week,
      partType = obj.partType,
      part = obj.part,
      school = obj.school,
      partBrother = obj.partBrother;
    let list = [], busyList = [], dateParam;
    let arrChristianLivingPartBrother = [];
    for (let part of week.christianLivingPart){
      arrChristianLivingPartBrother.push(part.brother._id);
    }

    // let busy = false;
    // let b = null;
    // if(this.PART_TYPE_ALL.indexOf(partType)!= -1){
    //   b = week[partType][school][partBrother];
    // }else{
    //   if(school)
    //     b = week[partType][school];
    //   else
    //     b = week[partType];
    // }

    let tempList = [];
    let allParts = CONST_ARR.PART_TYPE
    allParts.push("ministryPart")

    if (partType != "bibleReading" && partType != "ministryPart") {
      if (partType == "president") {
        tempList = [].concat(this.elderList)
          .filter(brother => (brother.elder && brother.elder.presidentEnabled
          && arrChristianLivingPartBrother.indexOf(brother._id) == -1));
        dateParam = "presidentDate";
      } else if (partType == "initialPrayer" || partType == "finalPrayer") {
        tempList = [].concat(this.prayerList)
          .filter(brother => (brother.prayer && brother.prayer.enabled
          && arrChristianLivingPartBrother.indexOf(brother._id) == -1));
        dateParam = "date";
      } else if(partType == "gems"){
        tempList = [].concat(this.elderList, this.servantList)
          .filter(brother =>
            (brother.elder && brother.elder.gemsEnabled || brother.servant && brother.servant.gemsEnabled
            && arrChristianLivingPartBrother.indexOf(brother._id) == -1));
        dateParam = "gemsDate";
      }else if(partType == "talk"){
        tempList = [].concat(this.elderList, this.servantList)
          .filter(brother =>
            (brother.elder && brother.elder.talkEnabled || brother.servant && brother.servant.talkEnabled
            && arrChristianLivingPartBrother.indexOf(brother._id) == -1));
        dateParam = "talkDate";
      }else if(partType == "congregationBibleStudy" && partBrother=="brother"){
        tempList = [].concat(this.elderList)
          .filter(brother => (brother.elder && brother.elder.bibleStudyEnabled
          && arrChristianLivingPartBrother.indexOf(brother._id) == -1));
        dateParam = "bibleStudyDate";
      }else if(partType == "congregationBibleStudy" && partBrother=="reader"){
        tempList = [].concat(this.readerList)
          .filter(brother => (brother.reader && brother.reader.enabled
          && arrChristianLivingPartBrother.indexOf(brother._id) == -1 ));
        dateParam = "date";
      }
    }else{
      let partTypeTemp = partType;

      if(partType=='ministryPart'){
        if(part.isTalk){
          partTypeTemp = "talk";
        }
        tempList = [].concat(this.studentList, this.studentListBusy)
          .filter(brother =>
            brother.student[partTypeTemp+"Enabled"]
            && brother.student[school+"Enabled"]
            && arrChristianLivingPartBrother.indexOf(brother._id) == -1
            && ((part[school].gender != '' && brother.gender == part[school].gender) || part[school].gender == '') )
      }else{
        tempList = [].concat(this.studentList, this.studentListBusy)
          .filter(brother =>
            brother.student[partTypeTemp+"Enabled"]
            && brother.student[school+"Enabled"]
            && arrChristianLivingPartBrother.indexOf(brother._id) == -1
            && brother.gender == 'M' )

      }
      tempList.sort((a:any,b:any) => {
        return (moment(a.student.lastDate).isBefore(b.student.lastDate) ? -1 : 1)});

      tempList = tempList.concat(this.elderList);

      dateParam = "lastDate";
    }
    for(let b of tempList){
      let busy = false;
      let partList: any = {
        'president': null,
        'initialPrayer': null,
        'gems': ['brother'],
        'talk': ['brother'],
        'congregationBibleStudy': ['brother', 'reader'],
        'finalPrayer': null
      }
      for (let p in partList) {
        if (partList[p]) {
          for (let sub of partList[p]) {
            // if (p != partType && school != sub) {
              if (b._id == week[p][sub]._id) {
                busy = true;
              }
            // }
          }
        } else {
          // if (p != partType) {
            if (b._id == week[p]._id) {
              busy = true;
            }
          // }
        }

      }
      var findBusy = function(part){
        for (let s of CONST_ARR.SCHOOLS) {
          if (part[s]) {
            if (part[s].student && b._id == part[s].student._id) {
              busy = true;
            }
            if (part[s].assistant && b._id == part[s].assistant._id) {
              busy = true;
            }
          }
        }
      }
      if (allParts.indexOf(partType) == -1) {
        findBusy(week.bibleReading)
        for (let part of week.ministryPart) {
          findBusy(part)
        }
      }
      if (allParts.indexOf(partType) != -1) {
        for (let w of this.weeks) {
          findBusy(w.bibleReading)
          for (let part of w.ministryPart) {
            findBusy(part)
          }
        }
      }
      if(busy){
        busyList.push(b);
      }else{
        list.push(b)
      }
    }
    this.changeMode.enabled=true;
    let that = this;

    this.changeMode = {
      class:'',
      busyError: false,
      week: week,
      partType: partType,
      part: part,
      school: school,
      partBrother:partBrother,
      list:list,
      listFiltered:[].concat(list),
      dateParam: dateParam,
      busyList:busyList,
      busyListFiltered:[].concat(busyList),
      enabled:true,
      // brotherToChange:{...week[partType][school][partBrother]},
      newBrother: null
    };
    this.elderListFiltered = [].concat(this.elderList);
    setTimeout(function(){
      that.changeMode.class='open';
    },200);
    if(school){
      if(part){
        this.changeMode.brotherToChange = {...part[school][partBrother]};
      }else{
        this.changeMode.brotherToChange = {...week[partType][school][partBrother]};
      }
    }else{
      this.changeMode.brotherToChange = {...week[partType][partBrother]};
    }
  }

  disableChangeMode(){
    this.changeMode.class="";
    let that = this;

    setTimeout(function(){
      that.changeMode = {
        class:'',
        busyError:false,
        week: null,
        list:null,
        busyList:null,
        brotherToChange:null,
        enabled:false
      };
    },500)

  }

  confirmChange(){

    if(this.changeMode.school){
      if(this.changeMode.part){
        this.changeMode.part[this.changeMode.school][this.changeMode.partBrother] = this.changeMode.newBrother
      }else{
        this.changeMode.week[this.changeMode.partType][this.changeMode.school][this.changeMode.partBrother] = this.changeMode.newBrother;
      }
    }else if(this.changeMode.partBrother)
      this.changeMode.week[this.changeMode.partType][this.changeMode.partBrother] = this.changeMode.newBrother;
    else
      this.changeMode.week[this.changeMode.partType] = this.changeMode.newBrother;
    if((this.PART_TYPE_ALL.indexOf(this.changeMode.partType) != -1) || this.changeMode.partType == "ministryPart"){
      // let arr : Array<Brother> = [].concat(this.busyErrorBrother);
      // arr = arr.filter(id => id != this.changeMode.brotherToChange._id);
      // if(this.changeMode.busyError){
      //   arr.push(this.changeMode.newBrother._id);
      // }
      // this.busyErrorBrother = arr;
      if(this.changeMode.brotherToChange && this.changeMode.brotherToChange.name && this.changeMode.brotherToChange.surname){
        this.studentList.push(this.changeMode.brotherToChange);
      }
      this.removeFromStudentList([this.changeMode.newBrother]);
      // for(let i=0; i<this.studentListBusy.length; i++){
      //   if(this.changeMode.brotherToChange._id == this.studentListBusy[i]._id){
      //     this.studentListBusy.splice(i, 1);
      //     break;
      //   }
      // }
    }
    this.disableChangeMode()
  }

  getValue(brother){
    if(brother && brother.name && brother.surname)
      return brother.name+' '+brother.surname;
    else
      return '';

  }

  backToConfig(){
    this.back.emit()
  }

  confirm(){
    localStorage["weeks_"+this.weeks[0].date.month()+"_"+this.weeks[0].date.year()] = JSON.stringify(this.weeks);
    this.dialogService.confirm("Confermi la creazione del programma?").subscribe(confirm => {
      if(confirm){
        this.loadingInsertPgm = true;
        this.newPgmService.insert(this.weeks).subscribe(res => {


          let week = this.weeks[0];

          this.meetingService.getPgm(week.date.year(), week.date.month()).subscribe((res : Array<WeekMeeting>) => {
            this.dialogService.openDownloadWeeksDialog(res, true, "PDF")
            this.loadingInsertPgm = false;
          },error => {
            console.log(error)
            this.loadingInsertPgm = false;
            this.dialogService.showError("Errore nella creazione del programma. Contattare l'amministratore.")
          });

        });
      }
    },err => {
      console.log(err)
      this.loadingInsertPgm = false;
      this.dialogService.showError("Errore nella creazione del programma. Contattare l'amministratore.")
    })

  }

  filterBrother(ev){
    if(typeof ev == "string"){
      this.elderListFiltered = this.elderList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
      this.changeMode.listFiltered = this.changeMode.list.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
      this.changeMode.busyListFiltered = this.changeMode.busyList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
    }
  }


}
