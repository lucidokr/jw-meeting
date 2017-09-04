/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {environment} from "../../environments/environment";
import {StudyNumber} from "../shared/models/studyNumber.model";

@Injectable()
export class StudyNumberService {
  studyNumberList: Array<StudyNumber>;
  constructor(
    private http: HttpInterceptor
  ) {
  }

  get(): Observable<Array<StudyNumber>> {
    if(this.studyNumberList && this.studyNumberList.length>0)
      return Observable.of(this.studyNumberList)
    else
      return this.http.get(environment.url + "/studyNumber", null)
        .map(res => {
          this.studyNumberList = res;
          return res;
        })
  }




}
