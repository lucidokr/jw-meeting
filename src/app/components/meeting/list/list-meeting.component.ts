import {ElderService} from "../../../services/elder.service";
import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "../../../services/dialog.service";
import {EmitterService} from "../../../services/emitter.service";
import {DateRenderComponent} from "../../../shared/components/dateRender.component";
import {MdSnackBar} from "@angular/material";
import {BooleanRenderComponent} from "../../../shared/components/booleanRender.component";
import {GeneralListComponent} from "../../../shared/components/list.component";
import {Elder} from "../../../shared/models/elder.model";
import {PrayerService} from "../../../services/prayer.service";
import {Prayer} from "../../../shared/models/prayer.model";
import {MeetingService} from "../../../services/meeting.service";

import * as moment from 'moment';
import {Observable} from "rxjs";
import {WeekMeeting} from "../../../shared/models/weekMeeting.model";
import {AuthService} from "../../../services/auth.service";
import {LocalDataSource} from "ng2-smart-table";
import {User} from "../../../shared/models/user.model";
import {USER_ROLE} from "../../../constant";

@Component({
  selector: 'prayer-list',
  templateUrl: './list-meeting.component.html'
})
export class MeetingListComponent extends GeneralListComponent{
  columns = {
    date: {
      title: 'Data',
      type: 'custom',
      renderComponent: DateRenderComponent
    },
    type:{
      title: 'Tipo',
      valuePrepareFunction: function(cell, row){

        return row.type.label + (row.supervisor?' - Visita del sorvegliante di circoscrizione':'');
      },
    },
    completed:{
      title: 'Completata',
      valuePrepareFunction: function(cell, row){
        return row.completed;
      },
      type: 'custom',
      renderComponent: BooleanRenderComponent
    },
    temporary : {
      title: 'Completa',
      valuePrepareFunction: function(cell, row){
        return !row.temp;
      },
      type: 'custom',
      renderComponent: BooleanRenderComponent
    }
  };
  public user : User;

  public constructor(      public meetingService: MeetingService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public authService: AuthService,
                           public snackBar: MdSnackBar) {
    super(dialogService, router, snackBar);

    this.user = authService.getUser();
    if(this.user.role == USER_ROLE.PRESIDENT){
      delete this.columns.completed;
    }else{
      delete this.columns.temporary;
    }
    this.service = meetingService;
    this.model.columns = this.columns;
    this.model.actions = {
      columnTitle: "Azioni",
      add:true,
      position: 'right',
      custom:[
        {
          name: 'view',
          title: '<fa><i class="fa fa-eye fa-lg"></i></fa>',
        },
        {
          name: 'download',
          title: '<fa><i class="fa fa-download fa-lg"></i></fa>',
        }

      ]
    };
    this.model.edit = null;
    this.model.delete = null;
    this.model.show.enabled = true;
    this.model.noDataMessage = "Nessuna adunanza aggiunta";
    this.emitterService.get("change_header_subtitle")
      .emit('Adunanze');
    // this.type = "Fratello per le preghiere";
    // this.dialogMethod = dialogService.openPrayer.bind(this.dialogService);
    // this.baseModel = Prayer;
    this.load();

  }

  public load():void{
    this.service.get().subscribe(weeks => {
      if(this.user.role == USER_ROLE.PRESIDENT){
        this.service.getTemp().subscribe(tempWeeks => {
          let arr = [];
          for(let tempWeek of tempWeeks){
            let find = false;
            let dt = tempWeek.date.clone().day(1);
            for(let week of weeks){
              let dw = week.date.clone().day(1);
              if(dt.date() == dw.date() && dt.month() == dw.month() && dt.year() == dw.year())
                find = true

            }
            if(!find){
              tempWeek.temp = true;
              arr.push(tempWeek);
            }
          }
          this.data = weeks.concat(arr);
          this.data = this.data.sort((a:any,b:any) => {return (moment(a.date).isAfter(b.date) ? -1 : 1)});
          this.source = new LocalDataSource(this.data);
        })
      }else{
        this.data = weeks;
        this.source = new LocalDataSource(this.data);
      }
    })
  }

  public onCustom(ev:any){
    if(ev.action == "view"){
      if(ev.data.temp){
        this.showTemp(ev)
      }else{
        this.show(ev)
      }
    }else if(ev.action == "download"){
      this.download(ev)
    }
  }

  public showTemp(ev){
    this.router.navigateByUrl(location.pathname + "/temp/" + ev.data._id)
  }

  public download(ev: any){

    let week = ev.data;
    if(!week.temp){
    // let dateArr = [];

      let date = week.date.clone().day(1);
      // let ms = date.month();
      // // date.startOf('week').isoWeekday(1);
      // let monday = date
      //   .startOf('month')
      //   .day(1)
      // if (monday.date() > 7) monday.add(7,'d');
      // let month = monday.month();
      // while(month === monday.month()){
      //   dateArr.push(moment(monday));
      //   monday.add(7,'d');
      // }
      // let meetings = []
      // console.log(this.data)
      // for(let d of dateArr){
      //   for(let w of this.data){
      //     if(w.date.isBetween(d, d.clone().add(7, 'd'))){
      //       meetings.push(this.meetingService.getMeeting(w._id));
      //     }
      //   }
      // }
      this.meetingService.getPgm(date.year(), date.month()).subscribe((res : Array<WeekMeeting>) => {
        this.dialogService.openDownloadWeeksDialog(res, false)
      });
    }else{
      this.dialogService.showError("Non è possibile scaricare le adunanze non complete")
    }

    // Observable.forkJoin(meetings).subscribe((res : Array<WeekMeeting>) => {
    //   this.dialogService.openDownloadWeeksDialog(res.sort((a:any,b:any) => {return (moment(a.date).isBefore(b.date) ? -1 : 1)}), false)
    // });
  }




}
