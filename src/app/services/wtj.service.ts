/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {MeetingWorkbook} from "../shared/models/meetingWorkbook.model";
import {environment} from "../../environments/environment";
import * as moment from "moment";


@Injectable()
export class WTJService {
  constructor(
    private http: HttpInterceptor,
  ) {
  }

  getMeetingWorkbook(date:any): Observable<MeetingWorkbook> {
    return this.http.get(environment.url+"/wtj/"+date.year()+"/"+(date.month()+1)+"/"+date.date(), null)
      .map(json => {
        if(json.data){
          let data = json.data;
          data.date = moment(date);
          return data;
        }else
          return null
      })
  }

  getMeetingWorkbooks(dates:Array<any>): Observable<Array<MeetingWorkbook>> {
    let obsArr = [];
    for(let date of dates){
      obsArr.push(this.getMeetingWorkbook(date))
    }
    return Observable.forkJoin(obsArr).map((res: Array<MeetingWorkbook>) => {
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
      });
  }



}
