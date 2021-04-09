/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {History} from "../shared/models/history.model";


@Injectable()
export class HistoryService {
  private url:string = "/history"
  constructor(
    private http: HttpClient,
  ) {
  }

  getHistory(): Observable<Array<History>> {
    return this.http.get<Array<History>>(environment.url + this.url, {responseType: 'json'})
  }

  getHistoryByStudent(studentId: string): Observable<Array<History>> {
    return this.http.get<Array<History>>(environment.url + this.url+"/"+studentId, {responseType: 'json'})
  }



}
