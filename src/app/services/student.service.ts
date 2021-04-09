/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Student} from "../shared/models/student.model";
import {environment} from "../../environments/environment";
import {Brother} from "../shared/models/brother.model";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class StudentService {
  url:string = "/student";
  constructor(
    private http: HttpClient
  ) {
  }

  get(): Observable<Array<Brother>> {
    return this.http.get<Brother[]>(environment.url + this.url, {responseType:'json'})
  }

  add(brother: Brother): Observable<string> {
    return this.http.post<string>(environment.url + this.url +"/"+brother._id, brother.student, {responseType:'json'})
  }

  edit(brother: Brother): Observable<string> {
    return this.http.put<string>(environment.url + this.url +"/"+brother._id, brother.student, {responseType:'json'})
  }

  delete(brotherId: string): Observable<boolean> {
    return this.http.delete<boolean>(environment.url + this.url +"/"+brotherId, {responseType:'json'})
  }



}
