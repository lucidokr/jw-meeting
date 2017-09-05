/**
 * Created by lucidokr on 04/04/17.
 */
import {Injectable} from '@angular/core';

import {Observable, Subject} from 'rxjs';
import {HttpInterceptor} from "../shared/http-interceptor.service";
import {MeetingWorkbook} from "../shared/models/meetingWorkbook.model";
import {environment} from "../../environments/environment";
import * as moment from "moment";
import {User} from "../shared/models/user.model";


@Injectable()
export class AuthService {

  private loginEvent = new Subject<any>();
  login$ = this.loginEvent.asObservable();

  public refreshTimeout : any = null;
  private _user: User = null;
  constructor(
    private http: HttpInterceptor,
  ) {
    let expires, user;
    if(localStorage.getItem("expires")) {
      expires = localStorage.getItem("expires");
    }
    if(localStorage.getItem("user")){
      user = JSON.parse(localStorage.getItem("user"));
    }
    if(expires){
      if(expires > new Date().getTime()){
        this.setRefreshToken(expires);
      }else{
        if(user){
          this.refreshToken(user.username, localStorage.getItem("refreshToken"));
        }else{
          this.logout(true);
        }
      }
    }
  }

  getUser(){
    if(!this._user){
      this._user = JSON.parse(localStorage.getItem("user"))
    }
    return this._user;
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
            localStorage.setItem("expires", ""+(obj.exp * 1000));
            localStorage.setItem("user", JSON.stringify(obj._doc));
          }
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          this.setRefreshToken(localStorage.getItem("expires"));
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
    this.loginEvent.next(false);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expires");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if(this.refreshTimeout){
      clearTimeout(this.refreshTimeout)
    }
    if(withReload)
      location.reload();
  }

  setRefreshToken(expires){
    let that = this;
    let diff = parseInt(expires) - new Date().getTime() - 36e5;
    if(this.refreshTimeout){
      clearTimeout(this.refreshTimeout)
    }
    this.refreshTimeout = setTimeout(function(){
      let user = JSON.parse(localStorage.getItem("user"));
      that.refreshToken(user.username, localStorage.getItem("refreshToken")).subscribe(token => {
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
            localStorage.setItem("expires",""+(obj.exp * 1000));
            localStorage.setItem("user",JSON.stringify(obj._doc));
          }
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          this.setRefreshToken(localStorage.getItem("expires"));
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
