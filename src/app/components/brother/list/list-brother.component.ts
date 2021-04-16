import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "../../../services/dialog.service";
import {EmitterService} from "../../../services/emitter.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import { GeneralListComponent } from "app/shared/components/list.component";

@Component({
  selector: 'brother-list',
  templateUrl: './list-brother.component.html'
})
export class BrotherListComponent extends GeneralListComponent<Brother>{
  
  columns = ['name', 'gender', 'email', 'actions'];

  public constructor(      public brotherService: BrotherService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MatSnackBar) {


    super(dialogService, router, snackBar);

    this.displayedColumns = this.columns;
    this.service = brotherService;
    this.dialogMethod = dialogService.openBrother.bind(this.dialogService);
    this.type = 'Fratello'
    this.load();

  }


}
