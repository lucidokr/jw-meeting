/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs'; 

import {environment} from "../../environments/environment";
import {WeekMeeting} from "../shared/models/weekMeeting.model";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MeetingService {
  url:string = "/week";
  constructor(
    private http: HttpClient
  ) {

  }

  get(): Observable<Array<WeekMeeting>> {
    return this.http.get<Array<WeekMeeting>>(environment.url + this.url, {responseType:'json'})
  }

  getPgm(year, month):Observable<Array<WeekMeeting>> {
    return this.http.get<Array<WeekMeeting>>(environment.url + this.url + "/pgm/"+year+"/"+(parseInt(month)+1), {responseType:'json'})
  }

  getTemp(): Observable<Array<WeekMeeting>> {
    return this.http.get<Array<WeekMeeting>>(environment.url + "/tempWeek", {responseType:'json'})
  }

  getMeeting(meetingId:string): Observable<WeekMeeting> {
    return this.http.get<WeekMeeting>(environment.url + this.url+"/"+meetingId, {responseType:'json'})
  }

  getMeetingTemp(meetingId:string): Observable<WeekMeeting> {
    return this.http.get<WeekMeeting>(environment.url +"/tempWeek/"+meetingId, {responseType:'json'})
  }

  updateMeeting(meetingId:string, week:WeekMeeting): Observable<void> {
    return this.http.put<void>(environment.url + this.url+"/"+meetingId, week, {responseType:'json'})
  }

  updateMeetingTemp(meetingId:string, week:WeekMeeting): Observable<any> {
    return this.http.put<any>(environment.url + "/tempWeek/"+meetingId, week, {responseType:'json'})
  }




}
