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
import {PrayerService} from "../../../services/prayer.service";
import {Prayer} from "../../../shared/models/prayer.model";

@Component({
  selector: 'prayer-list',
  templateUrl: 'list-prayer.component.html'
})
export class PrayerListComponent extends GeneralListComponent<Prayer>{
  columns = ['name', 'enabled', 'date', 'actions']
  // columns = {
  //   surname: {
  //     title: 'Cognome'
  //   },
  //   name: {
  //     title: 'Nome'
  //   },
  //   enabled: {
  //     title: 'Abilitato',
  //     valuePrepareFunction: function(cell, row){
  //       return row.prayer.enabled;
  //     },
  //     type: 'custom',
  //     renderComponent: BooleanRenderComponent
  //   },
  //   date: {
  //     title: 'Data',
  //     valuePrepareFunction: function(cell, row){
  //       return row.prayer.date;
  //     },
  //     type: 'custom',
  //     renderComponent: DateRenderComponent
  //   },
  // };

  public constructor(      public prayerService: PrayerService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MatSnackBar) {
    super(dialogService, router, snackBar);

    this.service = prayerService;
    this.displayedColumns = this.columns;
    // this.model.columns = this.columns;
    // this.model.noDataMessage = "Nessun fratello per le preghiere aggiunto";
    // this.emitterService.get("change_header_subtitle")
    //   .emit('Preghiere');
    this.type = "Fratello per le preghiere";
    this.dialogMethod = dialogService.openPrayer.bind(this.dialogService);
    // this.baseModel = Prayer;
    this.load();

  }


}
