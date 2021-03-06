import { Component } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {StudentService} from "../../../services/student.service";
import {Student} from "../../../shared/models/student.model";
import {Brother} from "../../../shared/models/brother.model";
import {MeetingService} from "../../../services/meeting.service";
import {WeekMeeting} from "../../../shared/models/weekMeeting.model";
import {EmitterService} from "../../../services/emitter.service";
import {AuthService} from "../../../services/auth.service";
import {USER_ROLE} from "../../../constant";
import {User} from "../../../shared/models/user.model";

@Component({
  selector: 'meeting-detail',
  templateUrl: './detail-meeting.component.html',
  styleUrls: ['./detail-meeting.component.scss']
})
export class MeetingDetailComponent {
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
        meetingService.getMeeting(params["meetingId"]).subscribe(week => {
          console.log(week)
          this.week = week;
          this.emitterService.get("change_header_subtitle")
            .emit('Adunanza '+week.date.format('D-MM-YY'));
          this.loading = false;
        },err => {
          this.loading = false;
        })
      }
    });

  }



}
