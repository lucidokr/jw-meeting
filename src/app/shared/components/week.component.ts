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

  public change(week, part, partBrother){
    this.onChange.emit({week:week, part:part, partBrother:partBrother})
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

  public checkBusyWeek(week, part, brother, forStudent){
    let busy = false;
    let b = part[brother];

    if(b){
      let partList: any = {
        'president': null,
        'initialPrayer':null,
        'gems':['brother'],
        'talk':['brother'],
        'congregationBibleStudy': ['brother','reader'],
        'finalPrayer':null
      }
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
      if(!forStudent) {
        for (let p of week.ministryPart) {
          if(p.forStudent){
            for (let school of this.PART_SCHOOLS) {
              if (p[school]) {
                if (p[school].student && b._id == p[school].student._id) {
                  busy = true;
                }
                if (p[school].assistant && b._id == p[school].assistant._id) {
                  busy = true;
                }
              }
            }
          }
        }
      }else{
        for(let w of this.weeks) {
          for (let p of w.ministryPart) {
            if(p.forStudent){
              for (let s of this.PART_SCHOOLS) {
                if (p[s] && (part != p || brother != 'student' || w.date != week.date)) {
                  if (p[s].student && b._id == p[s].student._id) {
                    busy = true;
                  }
                }
                if (p[s] && (part != p  || brother != 'assistant' || w.date != week.date)) {
                  if (p[s].assistant && b._id == p[s].assistant._id) {
                    busy = true;
                  }
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

