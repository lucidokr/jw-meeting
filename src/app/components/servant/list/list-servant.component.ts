import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Prayer} from "../../../shared/models/prayer.model";
import {DialogService} from "../../../services/dialog.service";
import {ServantService} from "../../../services/servant.service";
import {Servant} from "../../../shared/models/servant.model";
import {EmitterService} from "../../../services/emitter.service";
import {DateRenderComponent} from "../../../shared/components/dateRender.component";
import {MdSnackBar} from "@angular/material";
import {BooleanRenderComponent} from "../../../shared/components/booleanRender.component";
import {GeneralListComponent} from "../../../shared/components/list.component";

@Component({
  selector: 'servant-list',
  templateUrl: '../../../shared/components/list.component.html'
})
export class ServantListComponent extends GeneralListComponent{
  columns= {
    surname: {
      title: 'Cognome'
    },
    name: {
      title: 'Nome'
    },
    talkEnabled: {
      title: 'Discorso Tesori',
      valuePrepareFunction: function(cell, row){
        return row.servant.talkEnabled;
      },
      type: 'custom',
      renderComponent: BooleanRenderComponent
    },
    talkDate: {
      title: 'Data discorso',
      valuePrepareFunction: function(cell, row){
        return row.servant.talkDate;
      },
      type: 'custom',
      renderComponent: DateRenderComponent
    },
    gemsEnabled: {
      title: 'Gemme spirituali',
      valuePrepareFunction: function(cell, row){
        return row.servant.gemsEnabled;
      },
      type: 'custom',
      renderComponent: BooleanRenderComponent
    },
    gemsDate: {
      title: 'Data gemme',
      valuePrepareFunction: function(cell, row){
        return row.servant.gemsDate;
      },
      type: 'custom',
      renderComponent: DateRenderComponent
    },
  };

  public constructor(      public servantService: ServantService,
                           public dialogService: DialogService,
                           public router:Router,
                           public emitterService: EmitterService,
                           public snackBar: MdSnackBar) {
    super(dialogService, router, snackBar);

    this.service = servantService;
    this.model.columns = this.columns;
    this.model.noDataMessage = "Nessun servitore di ministero aggiunto";
    this.emitterService.get("change_header_subtitle")
      .emit('Servitori di ministero');
    this.type = "Servitore di ministero";
    this.dialogMethod = dialogService.openServant.bind(this.dialogService);
    this.baseModel = Servant;
    this.load();

  }


}
