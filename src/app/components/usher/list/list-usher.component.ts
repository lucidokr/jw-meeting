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
import {UsherService} from "../../../services/usher.service";
import {Usher} from "../../../shared/models/usher.model";

@Component({
  selector: 'usher-list',
  templateUrl: '../../../shared/components/list.component.html'
})
export class UsherListComponent extends GeneralListComponent{
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
        return row.usher.enabled;
      },
      type: 'custom',
      renderComponent: BooleanRenderComponent
    },
    date: {
      title: 'Data',
      valuePrepareFunction: function(cell, row){
        return row.usher.date;
      },
      type: 'custom',
      renderComponent: DateRenderComponent
    },
  };

  public constructor(      public usherService: UsherService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MdSnackBar) {
    super(dialogService, router, snackBar);

    this.service = usherService;
    this.model.columns = this.columns;
    this.model.noDataMessage = "Nessun usciere aggiunto";
    this.emitterService.get("change_header_subtitle")
      .emit('Uscieri');
    this.type = "Usciere";
    this.dialogMethod = dialogService.openUsher.bind(this.dialogService);
    this.baseModel = Usher;
    this.load();

  }


}
