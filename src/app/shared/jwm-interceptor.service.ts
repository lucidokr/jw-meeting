/**
 * Created by lucidokr on 06/04/17.
 */

 import { Injectable } from '@angular/core';
 import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
 import { Observable, throwError } from 'rxjs';
 import * as moment from 'moment'
 import { catchError, map } from 'rxjs/operators';

@Injectable()
export class JwmInterceptor implements HttpInterceptor {


  getRequestOptionArgs() : HttpHeaders {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json');
    if(localStorage.token) header = header.set('x-access-token', localStorage.token);
    return header;
  }

findDate(obj, keys){
    if(obj[keys]){
      if(typeof obj[keys] == "object"){
        for(let k in obj[keys]){
          this.findDate(obj[keys], k)
        }
      }else{
        if(keys.indexOf("Date") != -1 || keys.indexOf("date") != -1){
          if(obj[keys])
            obj[keys] = moment(obj[keys])
        }
      }
    }
  }

  loadingModal : any = null;
  authCount: number = 0;
  authCountMax : number = 3;

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let req = httpRequest.clone({headers: this.getRequestOptionArgs()});
    return next.handle(req).pipe(
      map(resp => {
        // Several HTTP events go through that Observable 
        // so we make sure that this is a HTTP response
        if (resp instanceof HttpResponse) {
           // Just like for request, we create a clone of the response
           // and make changes to it, then return that clone     
           let ev = resp.clone({ body: resp.body })
            
            if(ev.body.length && ev.body.length > 0){
              for(let obj of ev.body){
                for(let keys in obj){
                  this.findDate(obj, keys)
                }
              }
            }else{
              for(let keys in ev.body){
                this.findDate(ev.body, keys)
              }
            }
            return ev
          //  return  resp.clone({ body: [{title: 'Replaced data in interceptor'}] });
       }
     }),
      // map((event: HttpResponse<any>) => {
      //   let ev = event.clone({ body: event.body })
      //   let json = ev.body;
      //   function findDate(obj, keys){
      //     if(obj[keys]){
      //       if(typeof obj[keys] == "object"){
      //         for(let k in obj[keys]){
      //           findDate(obj[keys], k)
      //         }
      //       }else{
      //         if(keys.indexOf("Date") != -1 || keys.indexOf("date") != -1){
      //           if(obj[keys])
      //             obj[keys] = moment(obj[keys])
      //         }
      //       }
      //     }
      //   }
      //   if(json.length && json.length > 0){
      //     for(let obj of json){
      //       for(let keys in obj){
      //         findDate(obj, keys)
      //       }
      //     }
      //   }else{
      //     for(let keys in json){
      //       findDate(json, keys)
      //     }
      //   }
      //   return json
      // }),
      catchError((err, source) => {
        if (err.status === 403) {
          delete localStorage.token;
          // location.href = 'login'
          // this.router.navigateByUrl("login")
          return throwError(err.json() || 'Error');
        } else {
          // this.dialogService.showError("Errore di rete")
          return throwError(err.json() || 'Error');
        }
      })
    )
  }
}
