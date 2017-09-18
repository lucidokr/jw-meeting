import {Component, Input, Output, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import {Router} from "@angular/router";
import {MdSnackBar} from "@angular/material";
import {DialogService} from "../../services/dialog.service";
import {LocalDataSource} from "ng2-smart-table";
import {WeekMeeting} from "../models/weekMeeting.model";
import {Brother} from "../models/brother.model";
import {CONST} from "../../constant";

@Component({
  selector: 'week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnChanges {

  @Input() week: WeekMeeting ;
  @Input() weeks: Array<WeekMeeting> ;
  @Input() edit: boolean;
  @Input() busyErrorBrother: Array<string>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  public PART_TYPE = ['initialCall', 'returnVisit', 'bibleStudy'];
  public PART_TYPE_ALL = ['bibleReading', 'initialCall', 'returnVisit', 'bibleStudy'];
  public PART_SCHOOLS = ['primarySchool', 'secondarySchool'];

  public constructor(private dialogService: DialogService) {

  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName == "busyErrorBrother")
        this.busyErrorBrother = changedProp.currentValue;
      // let to = JSON.stringify(changedProp.currentValue);
      // if (changedProp.isFirstChange()) {
      //   log.push(`Initial value of ${propName} set to ${to}`);
      // } else {
      //   let from = JSON.stringify(changedProp.previousValue);
      //   log.push(`${propName} changed from ${from} to ${to}`);
      // }
    }
  }

  public change(week, partType, school, partBrother){
    this.onChange.emit({week:week, partType:partType, school:school, partBrother:partBrother})
  }

  public changeNumber(week, partType, school, partBrother){
    if(partType==CONST.BIBLE_READING){
      this.dialogService.openChangePoint(week[partType][school][partBrother].student.bibleReadingStudyNumber, true)
        .subscribe(newPoint =>{
          if(newPoint != null){
            week[partType][school].pointChanged = true;
            week[partType][school][partBrother].student.bibleReadingPendingStudyNumber = newPoint;
          }
        });
    }else{
      this.dialogService.openChangePoint(week[partType][school][partBrother].student.studyNumber, false)
        .subscribe(newPoint =>{
          if(newPoint != null){
            week[partType][school].pointChanged = true;
            week[partType][school][partBrother].student.pendingStudyNumber = newPoint;
          }
        });
    }
  }

  public checkBusy(student){
    if(student && student._id){
      let index = this.busyErrorBrother.indexOf(student._id)
      if(index == -1)
        return '';
      else
        return 'busy'+index;
    }
    return '';
    // return this.busyErrorBrother.indexOf(student._id) != -1
  }

  public checkBusyWeek(week, part, brother, type){
    let busy = false;
    let b = null;
    if(this.PART_TYPE_ALL.indexOf(part)!= -1){
      b = week[part][brother][type];
    }else{
      if(brother)
        b = week[part][brother];
      else
        b = week[part];
    }

    if(b){
      let partList: any = {
        'president': null,
        'initialPrayer':null,
        'gems':['brother'],
        'talk':['brother'],
        'congregationBibleStudy': ['brother','reader'],
        'finalPrayer':null
      }
      if(week.presentationExercise.enabled)
        partList.presentationExercise = ['brother'];
      for(let p in partList){
        if(partList[p]){
          for(let sub of partList[p]){
            if(p != part && brother != sub){
              if(b._id == week[p][sub]._id){
                busy = true;
              }
            }
          }
        }else{
          if(p != part){
            if(b._id == week[p]._id){
              busy = true;
            }
          }
        }

      }
      if(this.PART_TYPE_ALL.indexOf(part) == -1) {
        for (let p of this.PART_TYPE_ALL) {
          for (let s of this.PART_SCHOOLS) {
            if (week[p][s]) {
              if (week[p][s].student && b._id == week[p][s].student._id) {
                busy = true;
              }
              if (week[p][s].assistant && b._id == week[p][s].assistant._id) {
                busy = true;
              }
            }
          }
        }
      }
      if(this.PART_TYPE_ALL.indexOf(part)!= -1){
        for(let w of this.weeks) {
          for (let p of this.PART_TYPE_ALL) {
            for (let s of this.PART_SCHOOLS) {
              if (w[p][s] && (part != p || s != brother || type != 'student' || w.date != week.date)) {
                if (w[p][s].student && b._id == w[p][s].student._id) {
                  busy = true;
                }
              }
              if (w[p][s] && (part != p || s != brother || type != 'assistant' || w.date != week.date)) {
                if (w[p][s].assistant && b._id == w[p][s].assistant._id) {
                  busy = true;
                }
              }
            }
          }
        }
      }
      if(busy)
        return 'busy0';
    }
    // for(let p of PART_TYPE_ALL){
    //
    // }
  }

}

