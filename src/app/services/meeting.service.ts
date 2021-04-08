/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {environment} from "../../environments/environment";
import {WeekMeeting} from "../shared/models/weekMeeting.model";


@Injectable()
export class MeetingService {
  url:string = "/week";
  constructor(
    private http: HttpInterceptor
  ) {

  }

  get(): Observable<Array<WeekMeeting>> {
    return this.http.get(environment.url + this.url, null)
  }

  getPgm(year, month):Observable<Array<WeekMeeting>> {
    return this.http.get(environment.url + this.url + "/pgm/"+year+"/"+(parseInt(month)+1), null)
  }

  getTemp(): Observable<Array<WeekMeeting>> {
    return this.http.get(environment.url + "/tempWeek", null)
  }

  getMeeting(meetingId:string): Observable<WeekMeeting> {
    return this.http.get(environment.url + this.url+"/"+meetingId, null)
  }

  getMeetingTemp(meetingId:string): Observable<WeekMeeting> {
    return this.http.get(environment.url +"/tempWeek/"+meetingId, null)
  }

  updateMeeting(meetingId:string, week:WeekMeeting): Observable<void> {
    return this.http.put(environment.url + this.url+"/"+meetingId, week, null)
  }

  updateMeetingTemp(meetingId:string, week:WeekMeeting): Observable<void> {
    return this.http.put(environment.url + "/tempWeek/"+meetingId, week, null)
  }




}
