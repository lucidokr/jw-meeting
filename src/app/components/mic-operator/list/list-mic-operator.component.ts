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
import {MicOperatorService} from "../../../services/mic-operator.service";
import {MicOperator} from "../../../shared/models/mic-operator.model";

@Component({
  selector: 'mic-operator-list',
  templateUrl: '../../../shared/components/list.component.html'
})
export class MicOperatorListComponent extends GeneralListComponent{
  columns = {
    surname: {
      title: 'Cognome'
    },
    name: {
      title: 'Nome'
    },
    enabled: {
      title: 'Abilitato',
      valuePrepareFunction: function(cell, row){
        return row.micOperator.enabled;
      },
      type: 'custom',
      renderComponent: BooleanRenderComponent
    },
    date: {
      title: 'Data',
      valuePrepareFunction: function(cell, row){
        return row.micOperator.date;
      },
      type: 'custom',
      renderComponent: DateRenderComponent
    },
  };

  public constructor(      public micOperatorService: MicOperatorService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MdSnackBar) {
    super(dialogService, router, snackBar);

    this.service = micOperatorService;
    this.model.columns = this.columns;
    this.model.noDataMessage = "Nessun microfonista aggiunto";
    this.emitterService.get("change_header_subtitle")
      .emit('Microfonisti');
    this.type = "Microfonista";
    this.dialogMethod = dialogService.openMicOperator.bind(this.dialogService);
    this.baseModel = MicOperator;
    this.load();

  }


}
