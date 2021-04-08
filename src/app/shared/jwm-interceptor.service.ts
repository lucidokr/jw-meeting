/**
 * Created by lucidokr on 06/04/17.
 */

 import { Injectable } from '@angular/core';
 import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
 import { Observable, throwError } from 'rxjs';
 import * as moment from 'moment'
 
@Injectable()
export class JwmInterceptor implements HttpInterceptor {


  getRequestOptionArgs(header?: HttpHeaders) : HttpHeaders {
    if (header == null) {
      header = new HttpHeaders();
    }
    header.set('Content-Type', 'application/json');
    header.set('x-access-token', localStorage.token);

    return header;
  }

  loadingModal : any = null;
  authCount: number = 0;
  authCountMax : number = 3;

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let obs;
    httpRequest = httpRequest.clone({ headers: this.getRequestOptionArgs(httpRequest.headers) });
    this.getRequestOptionArgs(httpRequest.headers);
    obs = next.handle(httpRequest);
    return obs.catch((err, source) => {

      if (err.status === 403) {
        delete localStorage.token;
        this.router.navigateByUrl("login")
        return throwError(err.json() || 'Error');
      } else {
        // this.dialogService.showError("Errore di rete")
        return throwError(err.json() || 'Error');
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
