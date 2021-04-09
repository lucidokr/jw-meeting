import {Component, OnInit, HostListener, AfterContentInit} from '@angular/core';
import {AmChartsService} from "@amcharts/amcharts3-angular";
import {BrotherService} from "../../services/brother.service";
import {MeetingService} from "../../services/meeting.service";

import * as moment from 'moment';
import {WeekMeeting} from "../../shared/models/weekMeeting.model";
import {EmitterService} from "../../services/emitter.service";
import {AuthService} from "../../services/auth.service";
import {USER_ROLE} from "../../constant";
import {User} from "../../shared/models/user.model";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterContentInit{
  public currentWeek: WeekMeeting;
  public date: any;
  private count: any;
  public loadingCount = true;
  public loadingMeeting = true;
  public user: User = null;

  public USER_ROLE = USER_ROLE;


  constructor(private AmCharts: AmChartsService, private brotherService:BrotherService, private meetingService: MeetingService, private emitterService:EmitterService, private authService:AuthService) {
    this.user = authService.getUser();
  }

  ngAfterContentInit(){
    this.emitterService.get("change_header_subtitle")
      .emit('Home');
    this.date = moment();
    this.meetingService.get().subscribe(weeks => {
      let date = moment()
      if(weeks.length > 0){
        for(let week of weeks){
          if(week.date.isBetween(moment(date).day(1), moment(date).day(7))){
            this.meetingService.getMeeting(week._id).subscribe(week => {
                this.currentWeek = week;
                this.loadingMeeting = false;
            }, err => {
              this.loadingMeeting = false;
            })
            break;
          }else{
            this.loadingMeeting = false;
          }
        }
      }else{
        this.loadingMeeting = false;
      }
    }, err=>{
      this.loadingMeeting = false;
    })

    this.brotherService.get().subscribe(brothers => {
      this.loadingCount = false;
      this.count = [
        {count:brothers.length, label:"Fratelli"},
        {count:brothers.filter(brother => (brother.student)).length, label:"Studenti"},
        {count:brothers.filter(brother => (brother.servant)).length, label:"Servitori"},
        {count:brothers.filter(brother => (brother.elder)).length, label:"Anziani"},
        {count:brothers.filter(brother => (brother.prayer)).length, label:"Preghiere"},
        {count:brothers.filter(brother => (brother.reader)).length, label:"Lettori"}
      ];
    }, err =>{
      this.loadingCount = false
    })

  }

  getCounterWidth(){
    if(window.innerWidth<768){
      return (200/this.count.length)+"%";
    }else{
      return (100/this.count.length)+"%";
    }
  }


}
