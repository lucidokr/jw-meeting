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
  templateUrl: '../../../shared/components/list.component.html'
})
export class ElderListComponent extends GeneralListComponent{
  columns = {
    surname: {
      title: 'Cognome',

    },
    name: {
      title: 'Nome'
    },
    presidentEnabled: {
      title: 'Presidente',
      type: 'custom',
      valuePrepareFunction: function(cell, row){
        return row.elder.presidentEnabled;
      },
      renderComponent: BooleanRenderComponent
    },
    // presidentDate: {
    //   title: 'Data presidente',
    //   type: 'custom',
    //   renderComponent: DateRenderComponent
    // },
    talkEnabled: {
      title: 'Discorso Tesori',
      type: 'custom',
      valuePrepareFunction: function(cell, row){
        return row.elder.talkEnabled;
      },
      renderComponent: BooleanRenderComponent
    },
    // talkDate: {
    //   title: 'Data discorso',
    //   type: 'custom',
    //   renderComponent: DateRenderComponent
    // },
    gemsEnabled: {
      title: 'Gemme spirituali',
      type: 'custom',
      valuePrepareFunction: function(cell, row){
        return row.elder.gemsEnabled;
      },
      renderComponent: BooleanRenderComponent
    },
    bibleStudyEnabledEnabled: {
      title: 'Studio biblico',
      type: 'custom',
      valuePrepareFunction: function(cell, row){
        return row.elder.bibleStudyEnabled;
      },
      renderComponent: BooleanRenderComponent
    },
    // gemsDate: {
    //   title: 'Data gemme',
    //   type: 'custom',
    //   renderComponent: DateRenderComponent
    // },
  };

  public constructor(      public elderService: ElderService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MatSnackBar) {
    super(dialogService, router, snackBar);

    this.service = elderService;
    this.model.columns = this.columns;
    this.model.noDataMessage = "Nessun anziano aggiunto";
    this.emitterService.get("change_header_subtitle")
      .emit('Anziani di congregazione');
    this.type = "Anziano di congregazione";
    this.dialogMethod = dialogService.openElder.bind(this.dialogService);
    this.baseModel = Brother;
    this.load();

  }


}
