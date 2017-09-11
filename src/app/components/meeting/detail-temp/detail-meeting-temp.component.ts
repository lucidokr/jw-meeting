import { Component } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {StudentService} from "../../../services/student.service";
import {Student} from "../../../shared/models/student.model";
import {Brother} from "../../../shared/models/brother.model";
import {MeetingService} from "../../../services/meeting.service";
import {WeekMeeting} from "../../../shared/models/weekMeeting.model";
import {StudyNumber} from "../../../shared/models/studyNumber.model";
import {StudyNumberService} from "../../../services/study-number.service";
import {EmitterService} from "../../../services/emitter.service";
import {AuthService} from "../../../services/auth.service";
import {USER_ROLE} from "../../../constant";
import {User} from "../../../shared/models/user.model";

@Component({
  selector: 'meeting-detail-temp',
  templateUrl: './detail-meeting-temp.component.html'
})
export class MeetingDetailTempComponent {
  public week : WeekMeeting;
  public loading : boolean = true;

  public user : User = null;

  public USER_ROLE = USER_ROLE;

  constructor(private meetingService:MeetingService,
              private route: ActivatedRoute,
              private emitterService:EmitterService,
              private authService:AuthService) {
    this.emitterService.get("change_header_subtitle")
      .emit('Adunanze');
    this.user = authService.getUser();

    this.route.params.subscribe(params => {
      if(params["meetingId"]){
        meetingService.getMeetingTemp(params["meetingId"]).subscribe(week => {
          console.log(week)
          this.week = week;
          this.emitterService.get("change_header_subtitle")
            .emit('Adunanza '+week.date.format('DD-MM-YY'));
          this.loading = false;
        },err => {
          this.loading = false;
        })
      }
    });

  }



}
