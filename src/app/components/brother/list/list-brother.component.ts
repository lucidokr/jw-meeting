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
import {BrotherService} from "../../../services/brother.service";

@Component({
  selector: 'brother-list',
  templateUrl: './list-brother.component.html'
})
export class BrotherListComponent extends GeneralListComponent{
  columns = {
    surname: {
      title: 'Cognome',
    },
    name: {
      title: 'Nome'
    },
    gender: {
      title: 'Sesso'
    },
    email: {
      title: 'E-mail'
    }
  };

  public constructor(      public brotherService: BrotherService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MatSnackBar) {
    super(dialogService, router, snackBar);

    this.service = brotherService;
    this.model.columns = this.columns;
    this.model.noDataMessage = "Nessun fratello aggiunto";
    this.emitterService.get("change_header_subtitle")
      .emit('Fratelli');
    this.type = "Fratello";
    this.dialogMethod = dialogService.openBrother.bind(this.dialogService);
    this.load();

  }


}
