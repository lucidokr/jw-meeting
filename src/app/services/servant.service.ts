/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {environment} from "../../environments/environment";
import {Prayer} from "../shared/models/prayer.model";
import {MdDialog} from "@angular/material";
import {Servant} from "../shared/models/servant.model";

import * as moment from 'moment';
import {Brother} from "../shared/models/brother.model";

@Injectable()
export class ServantService {
  url:string = "/servant";
  constructor(
    private http: HttpInterceptor
  ) {
  }

  get(): Observable<Array<Brother>> {
    return this.http.get(environment.url + this.url, null)
  }

  add(brother: Brother): Observable<string> {
    return this.http.post(environment.url + this.url +"/"+brother._id, brother.servant, null)
  }

  edit(brother: Brother): Observable<string> {
    return this.http.put(environment.url + this.url +"/"+brother._id, brother.servant, null)
  }

  delete(brotherId: string): Observable<boolean> {
    return this.http.delete(environment.url + this.url +"/"+brotherId, null)
  }


}
