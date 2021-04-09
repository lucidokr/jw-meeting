/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Brother} from "../shared/models/brother.model";


@Injectable()
export class ElderService {
  url:string = "/elder";
  constructor(
    private http: HttpClient
  ) {
  }

  get(): Observable<Array<Brother>> {
    return this.http.get<Array<Brother>>(environment.url + this.url, {responseType: 'json'})
  }

  add(brother: Brother): Observable<string> {
    return this.http.post<string>(environment.url + this.url +"/"+brother._id, brother.elder, {responseType: 'json'})
  }

  edit(brother: Brother): Observable<string> {
    return this.http.put<string>(environment.url + this.url +"/"+brother._id, brother.elder, {responseType: 'json'})
  }

  delete(brotherId: string): Observable<boolean> {
    return this.http.delete<boolean>(environment.url + this.url +"/"+brotherId, {responseType: 'json'})
  }

}
