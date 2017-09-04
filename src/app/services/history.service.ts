/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {environment} from "../../environments/environment";
import {History} from "../shared/models/history.model";


@Injectable()
export class HistoryService {
  private url:string = "/history"
  constructor(
    private http: HttpInterceptor,
  ) {
  }

  getHistory(): Observable<Array<History>> {
    return this.http.get(environment.url + this.url, null)
  }

  getHistoryByStudent(studentId: string): Observable<Array<History>> {
    return this.http.get(environment.url + this.url+"/"+studentId, null)
  }



}
