import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "../../../services/dialog.service";
import {EmitterService} from "../../../services/emitter.service";
import {DateRenderComponent} from "../../../shared/components/dateRender.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GeneralListComponent} from "../../../shared/components/list.component";
import {StudentService} from "../../../services/student.service";
import {Student} from "../../../shared/models/student.model";

@Component({
  selector: 'student-list',
  templateUrl: '../../../shared/components/list.component.html'
})
export class StudentListComponent extends GeneralListComponent{
  columns = {
    surname: {
      title: 'Cognome',
      filter: false,
    },
    name: {
      title: 'Nome'
    },
    lastDate: {
      title: 'Data ultimo discorso',
      valuePrepareFunction: function(cell, row){
        if(row.student.lastDate)
          return row.student.lastDate;
        else
          return null
      },
      type: 'custom',
      renderComponent: DateRenderComponent
    }

  };

  public constructor(      public studentService: StudentService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MatSnackBar) {
    super(dialogService, router, snackBar);

    this.service = studentService;
    this.model.columns = this.columns;
    this.model.show.enabled = true;
    this.model.noDataMessage = "Nessuno studente aggiunto";
    this.emitterService.get("change_header_subtitle")
      .emit('Studenti');
    this.type = "Studente";
    this.dialogMethod = dialogService.openStudent.bind(this.dialogService);
    this.baseModel = Student;
    this.load();

  }


}
