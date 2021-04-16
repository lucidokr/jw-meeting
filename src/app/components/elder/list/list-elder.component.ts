import {ElderService} from "../../../services/elder.service";
import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "../../../services/dialog.service";
import {EmitterService} from "../../../services/emitter.service";
import {DateRenderComponent} from "../../../shared/components/dateRender.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BooleanRenderComponent} from "../../../shared/components/booleanRender.component";
import {GeneralListComponent} from "../../../shared/components/list.component";
import {Elder} from "../../../shared/models/elder.model";
import {Brother} from "../../../shared/models/brother.model";

@Component({
  selector: 'elder-list',
  templateUrl: 'list-elder.component.html'
})
export class ElderListComponent extends GeneralListComponent<Elder>{
  columns = ['name', 'president', 'teasure', 'gems', 'bibleStudy', 'actions']

  public constructor(      public elderService: ElderService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MatSnackBar) {
    super(dialogService, router, snackBar);

    this.displayedColumns = this.columns;
    this.service = elderService;
    this.type = "Anziano di congregazione";
    this.dialogMethod = dialogService.openElder.bind(this.dialogService);
    this.load();

  }


}
