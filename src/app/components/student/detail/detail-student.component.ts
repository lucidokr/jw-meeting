import { Component } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {DialogService} from "../../../services/dialog.service";
import {EmitterService} from "../../../services/emitter.service";
import {DateRenderComponent} from "../../../shared/components/dateRender.component";
import {MdSnackBar} from "@angular/material";
import {GeneralListComponent} from "../../../shared/components/list.component";
import {StudentService} from "../../../services/student.service";
import {Student} from "../../../shared/models/student.model";
import {HistoryService} from "../../../services/history.service";
import {LocalDataSource} from "ng2-smart-table";
import {BooleanRenderComponent} from "../../../shared/components/booleanRender.component";

@Component({
  selector: 'student-list',
  templateUrl: './detail-student.component.html'
})
export class StudentDetailComponent extends GeneralListComponent{
  columns = {
    lastDate: {
      title: 'Data',
      valuePrepareFunction: function(cell, row){
        if(row.date)
          return row.date;
        else
          return null
      },
      type: 'custom',
      renderComponent: DateRenderComponent
    },
    made: {
      title: 'Svolto',
      type: 'custom',
      renderComponent: BooleanRenderComponent
    }

  };

  public constructor(      public historyService: HistoryService,
                           public dialogService: DialogService,
                           public router:Router,
                           public route:ActivatedRoute,
                           public emitterService: EmitterService,
                           public snackBar: MdSnackBar) {
    super(dialogService, router, snackBar);

    this.service = historyService;
    this.model.columns = this.columns;
    this.model.show.enabled = false;
    this.model.edit = null;
    this.model.delete = null;
    this.model.hideSubHeader = true;
    this.model.actions = null;
    this.model.noDataMessage = "Nessuno storico";
    this.emitterService.get("change_header_subtitle")
      .emit('Studente');
    this.type = "Studente";
    this.dialogMethod = dialogService.openStudent.bind(this.dialogService);
    this.baseModel = Student;
    this.route.params.subscribe(params => {
      if(params["studentId"]){
        this.loadCustom(params["studentId"]);
      }
    });

  }

  public loadCustom(studentId: string):void{
    this.service.getHistoryByStudent(studentId).subscribe(res => {
      if(res.length > 0)
      this.emitterService.get("change_header_subtitle")
        .emit("Studente: "+res[0].student.surname + " " + res[0].student.name);
      this.data = res;
      this.source = new LocalDataSource(this.data);
    })
  }


}
