/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {Student} from "../shared/models/student.model";
import {environment} from "../../environments/environment";
import {Brother} from "../shared/models/brother.model";


@Injectable()
export class StudentService {
  url:string = "/student";
  constructor(
    private http: HttpInterceptor
  ) {
  }

  get(): Observable<Array<Brother>> {
    return this.http.get(environment.url + this.url, null)
  }

  add(brother: Brother): Observable<string> {
    return this.http.post(environment.url + this.url +"/"+brother._id, brother.student, null)
  }

  edit(brother: Brother): Observable<string> {
    return this.http.put(environment.url + this.url +"/"+brother._id, brother.student, null)
  }

  delete(brotherId: string): Observable<boolean> {
    return this.http.delete(environment.url + this.url +"/"+brotherId, null)
  }



}
