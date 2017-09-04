/**
 * Created by lucidokr on 06/04/17.
 */

import { Injectable } from '@angular/core';
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Headers,
  Request, XHRBackend, ConnectionBackend, URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as moment from 'moment';
import {Router} from "@angular/router";


@Injectable()
export class HttpInterceptor extends Http {

  sessionId : string;
  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router) {
    super(backend, defaultOptions);

  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.get, url, null, options);
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.post, url, body, options);
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.put, url, body, options);
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.delete, url, null, options);
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.patch, url, body, options);
  }

  getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.set('Content-Type', 'application/json');
    options.headers.set('x-access-token', localStorage.token);

    return options;
  }

  loadingModal : any = null;
  authCount: number = 0;
  authCountMax : number = 3;

  intercept(callback: any, url: string | Request, body: string, options?: RequestOptionsArgs): Observable<any> {

    let obs;
    let opt = this.getRequestOptionArgs(options);
    if (body){
      obs = callback.call(this, url, body, opt);
    }else{
      obs = callback.call(this, url, opt);
    }
    return obs.catch((err, source) => {

      if (err.status === 403) {
        delete localStorage.token;
        this.router.navigateByUrl("login")
        return Observable.throw(err.json() || 'Error');
      } else {
        // this.dialogService.showError("Errore di rete")
        return Observable.throw(err.json() || 'Error');
      }
    })
    .do((res: Response) => {
    }, (error: any) => {
    })
    .map(res => {
      let json = res.json();
      function findDate(obj, keys){
        if(obj[keys]){
          if(typeof obj[keys] == "object"){
            for(let k in obj[keys]){
              findDate(obj[keys], k)
            }
          }else{
            if(keys.indexOf("Date") != -1 || keys.indexOf("date") != -1){
              if(obj[keys])
                obj[keys] = moment(obj[keys])
            }
          }
        }
      }
      if(json.length && json.length > 0){
        for(let obj of json){
          for(let keys in obj){
            findDate(obj, keys)
          }
        }
      }else{
        for(let keys in json){
          findDate(json, keys)
        }
      }
      return json
    })
    .finally(() => {
      return this.onFinally()
    });
  }


  private onFinally(): void {
    // this.responseInterceptor();
  }

}

export function HttpInterceptorFactory(connectionBackend: XHRBackend, requestOptions: RequestOptions, router:Router): Http {
  return new HttpInterceptor(connectionBackend, requestOptions, router);
}
