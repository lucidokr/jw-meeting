/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {MeetingWorkbook} from "../shared/models/meetingWorkbook.model";
import {environment} from "../../environments/environment";
import * as moment from "moment";


@Injectable()
export class AuthService {

  public refreshTimeout : any = null;
  constructor(
    private http: HttpInterceptor,
  ) {
    let expires, user;
    if(localStorage.expires) {
      expires = localStorage.expires;
    }
    if(localStorage.user){
      user = JSON.parse(localStorage.user);
    }
    if(expires){
      if(expires > new Date().getTime()){
        this.setRefreshToken(expires);
      }else{
        if(user){
          this.refreshToken(user.username, localStorage.refreshToken);
        }else{
          this.logout(true);
        }
      }
    }
  }

  getUser(){
    return JSON.parse(localStorage.getItem("user"));
  }

  login(username:string, password:string): Observable<string> {
    return this.http.post(environment.url+"/auth/login", {username:username, password:password}, null)
      .map(json => {
        if(json.success){
          let token = json.token;
          let refreshToken = json.refreshToken;
          let arr = token.split(".");
          if(arr[1]){
            let obj = JSON.parse(atob(arr[1]));
            localStorage.expires = obj.exp * 1000;
            localStorage.user = JSON.stringify(obj._doc)
          }
          localStorage.token = token;
          localStorage.refreshToken = refreshToken;
          this.setRefreshToken(localStorage.expires);
          return json.token;

        }else{
          this.logout(false);
          return null;
        }
      }).catch(err => {
        this.logout(false);
        return null;
      })
  }

  logout(withReload){
    delete localStorage.refreshToken;
    delete localStorage.expires;
    delete localStorage.token;
    delete localStorage.user;
    if(this.refreshTimeout){
      clearTimeout(this.refreshTimeout)
    }
    if(withReload)
      location.reload();
  }

  setRefreshToken(expires){
    let that = this;
    let diff = expires - new Date().getTime() - 36e5;
    if(this.refreshTimeout){
      clearTimeout(this.refreshTimeout)
    }
    this.refreshTimeout = setTimeout(function(){
      let user = JSON.parse(localStorage.user);
      that.refreshToken(user.username, localStorage.refreshToken).subscribe(token => {
        if(token){
          console.log("Token refreshed")
        }
      });
    }, diff)
  }

  refreshToken(username, refreshToken){
    return this.http.post(environment.url+"/auth/refresh", {username:username, refreshToken:refreshToken}, null)
      .map(json => {
        if(json.success){
          let token = json.token;
          let refreshToken = json.refreshToken;
          let arr = token.split(".");
          if(arr[1]){
            let obj = JSON.parse(atob(arr[1]));
            localStorage.expires = obj.exp * 1000;
            localStorage.user = JSON.stringify(obj._doc)
          }
          localStorage.token = token;
          localStorage.refreshToken = refreshToken;

          this.setRefreshToken(localStorage.expires);
          return json.token;

        }else{
          this.logout(true);
          return null;
        }
      }).catch(err => {
        this.logout(true);
        return null;
      })
  }



}
