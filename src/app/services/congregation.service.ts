/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import { Congregation } from 'app/shared/models/congregation.model';


@Injectable()
export class CongregationService {
  private url:string = "/congregation"
  constructor(
    private http: HttpClient,
  ) {
  }

  getCongregations(): Observable<Array<Congregation>> {
    return this.http.get<Array<Congregation>>(environment.url + this.url, {responseType: 'json'})
  }

  getCongregation(id: string): Observable<Array<Congregation>> {
    return this.http.get<Array<Congregation>>(environment.url + this.url+"/"+id, {responseType: 'json'})
  }

  updateCongregation(congregation: Congregation): Observable<any> {
    return this.http.put(environment.url + this.url+"/"+congregation._id, congregation, {responseType: 'json'})
  }

  deleteCongregation(congregation: Congregation): Observable<any> {
    return this.http.delete(environment.url + this.url+"/"+congregation._id, null)
  }


}
