/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {WeekMeeting} from "../shared/models/weekMeeting.model";
import {environment} from "../../environments/environment";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class NewPgmService {

  public newPgm: Array<WeekMeeting> = [];

  constructor(
    private http: HttpClient
  ) {
  }


  public insert(weeks: Array<WeekMeeting>){
    return this.http.post(environment.url + "/week", weeks)
  }

  public insertTemp(weeks: Array<WeekMeeting>){
    return this.http.post(environment.url + "/tempWeek", weeks)
  }




}
