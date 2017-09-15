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
import {AcousticsService} from "../../../services/acoustics.service";
import {Acoustics} from "../../../shared/models/acoustics.model";

@Component({
  selector: 'acoustics-list',
  templateUrl: '../../../shared/components/list.component.html'
})
export class AcousticsListComponent extends GeneralListComponent{
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
        return row.acoustics.enabled;
      },
      type: 'custom',
      renderComponent: BooleanRenderComponent
    },
    date: {
      title: 'Data',
      valuePrepareFunction: function(cell, row){
        return row.acoustics.date;
      },
      type: 'custom',
      renderComponent: DateRenderComponent
    },
  };

  public constructor(      public acousticsService: AcousticsService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MdSnackBar) {
    super(dialogService, router, snackBar);

    this.service = acousticsService;
    this.model.columns = this.columns;
    this.model.noDataMessage = "Nessun fratello per l'acustica aggiunto";
    this.emitterService.get("change_header_subtitle")
      .emit('Acustica');
    this.type = "Fratello per l'acustica";
    this.dialogMethod = dialogService.openAcoustics.bind(this.dialogService);
    this.baseModel = Acoustics;
    this.load();

  }


}
