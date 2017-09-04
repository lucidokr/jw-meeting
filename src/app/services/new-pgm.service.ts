/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {WeekMeeting} from "../shared/models/weekMeeting.model";
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {environment} from "../../environments/environment";


@Injectable()
export class NewPgmService {

  public newPgm: Array<WeekMeeting> = [];

  constructor(
    private http: HttpInterceptor
  ) {
  }


  public insert(weeks: Array<WeekMeeting>){
    return this.http.post(environment.url + "/week", weeks)
  }

  public insertTemp(weeks: Array<WeekMeeting>){
    return this.http.post(environment.url + "/week/temp", weeks)
  }




}
