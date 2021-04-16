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
import {Reader} from "../../../shared/models/reader.model";
import {ReaderService} from "../../../services/reader.service";

@Component({
  selector: 'reader-list',
  templateUrl: 'list-reader.component.html'
})
export class ReaderListComponent extends GeneralListComponent<Reader>{
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
  //       return row.reader.enabled;
  //     },
  //     type: 'custom',
  //     renderComponent: BooleanRenderComponent
  //   },
  //   date: {
  //     title: 'Data',
  //     valuePrepareFunction: function(cell, row){
  //       return row.reader.date;
  //     },
  //     type: 'custom',
  //     renderComponent: DateRenderComponent
  //   },
  // };

  public constructor(      public readerService: ReaderService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MatSnackBar) {
    super(dialogService, router, snackBar);

    this.service = readerService;
    this.displayedColumns = this.columns;
    // this.model.columns = this.columns;
    // this.model.noDataMessage = "Nessun lettore aggiunto";
    // this.emitterService.get("change_header_subtitle")
    //   .emit('Lettori');
    this.type = "Lettore";
    this.dialogMethod = dialogService.openReader.bind(this.dialogService);
    // this.baseModel = Reader;
    this.load();

  }


}
