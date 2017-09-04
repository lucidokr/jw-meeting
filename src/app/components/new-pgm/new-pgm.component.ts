import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../../services/student.service";
import * as moment from 'moment';
import {WTJService} from "../../services/wtj.service";
import {WeekMeeting} from "../../shared/models/weekMeeting.model";
import {EmitterService} from "../../services/emitter.service";
import {NewPgmService} from "../../services/new-pgm.service";
import {AuthService} from "../../services/auth.service";
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {USER_ROLE} from "../../constant";

@Component({
  selector: 'new-pgm',
  templateUrl: './new-pgm.component.html',
  styleUrls: ['./new-pgm.component.scss']
})
export class NewPgmComponent {
  public config : boolean = true;
  public weeks : Array<WeekMeeting> = [];
  public user: any;
  public USER_ROLE = USER_ROLE;

  snackBarConfig : MdSnackBarConfig = new MdSnackBarConfig();


  constructor(private router:Router,
              private snackBar:MdSnackBar,
              private emitterService:EmitterService,
              private newPgmService: NewPgmService,
              private authService: AuthService) {
    this.emitterService.get("change_header_subtitle")
      .emit('Nuovo programma');

    this.user = authService.getUser();
    this.snackBarConfig.duration = 5000;
  }

  public complete(weeks: Array<WeekMeeting>){
    this.weeks = weeks;
    this.config = false;
    console.log(this.weeks);
  }

  public completeTemp(weeks: Array<WeekMeeting>){
    this.newPgmService.insertTemp(weeks).subscribe(res => {
      this.snackBar.open("Programma inserito correttamente", null, this.snackBarConfig);
      this.router.navigateByUrl("home");
    }, err => {
      this.snackBar.open("Programma non inserito", null, this.snackBarConfig);
    })
    // this.weeks = weeks;
    // this.config = false;
     console.log(this.weeks);
  }

  public back(){
    this.config = true;
  }



}
