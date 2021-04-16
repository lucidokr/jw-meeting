/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {MeetingWorkbook} from "../shared/models/meetingWorkbook.model";
import {environment} from "../../environments/environment";
import * as moment from "moment";


@Injectable()
export class WTJService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getMeetingWorkbook(date:any): Observable<MeetingWorkbook> {
    let dateStart = date;
    let dateEnd = moment(date).add(6, 'd');
    let dateStartStr, dateEndStr
    dateStartStr = dateStart.date()
    // if(dateStart.format("MMM") == dateEnd.format("MMM")){
    //   dateStartStr = dateStart.date()
    //   dateEndStr = dateEnd.date()+"-"+dateStart.format("MMMM")
    // }else{
    //   dateStartStr = dateStart.date() + "-" + dateStart.format("MMMM")
    //   dateEndStr = dateEnd.date() + "-" + dateEnd.format("MMMM")
    // }
    return this.http.get<any>(environment.url+"/wtj/"+date.year()+"/"+date.format('MM') +"/"+dateStartStr/*+"/"+dateEndStr*/, {responseType:'json'})
    .pipe(
      map(res => {
        if(res){
          let data = res.data;
          data.date = moment(date);
          return data;
        }else
          return null
      })
      )
  }

  getMeetingWorkbooks(dates:Array<any>): Observable<Array<MeetingWorkbook>> {
    let obsArr = [];
    for(let date of dates){
      obsArr.push(this.getMeetingWorkbook(date))
    }
    return forkJoin(obsArr).pipe(map((res: Array<MeetingWorkbook>) => {
      let flagValid = true;
      if(res && res.length > 0){
        res.forEach(function(r){
          if(!r || r == null){
            flagValid = false
          }
        })
      }
      if(flagValid)
        return res;
      else
        return null;
      }));
  }



}
