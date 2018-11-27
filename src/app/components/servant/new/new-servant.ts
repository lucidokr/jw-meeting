import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';
import {Prayer} from "../../../shared/models/prayer.model";
import {Servant} from "../../../shared/models/servant.model";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";

@Component({
    selector: 'new-servant-dialog',
  styles: ['.mat-checkbox { margin-right: 22px; }'],
    template: `
    <form #form="ngForm" fxLayout="column" fxLayoutAlign="center center" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center">
         <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <md-input-container fxFlex class="brother-autocomplete">
              <input type="text" mdInput [mdAutocomplete]="auto" [(ngModel)]="brother" (ngModelChange)="filterBrother($event)" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" name="brother" placeholder="Seleziona fratello">
            </md-input-container>
            <md-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <md-option (onSelectionChange)="newServant(b)" *ngFor="let b of brotherListFiltered" [value]="b">
                  {{b.surname}} {{b.name}}
               </md-option>
            </md-autocomplete>
          </div>
          <div *ngIf="!loading && brotherList && brotherList.length == 0 && !edit">
            Nessun fratello da aggiungere
          </div>
          <div *ngIf="brother && edit" fxFlex>
            <h3>{{brother.name}} {{brother.surname}}</h3>
          </div>
          <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" *ngIf="brother && brother.servant">

            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.servant.christianLivingPartEnabled" name="christianLivingPartEnabled" >
                      Parti Vita Cristiana
                  </md-checkbox>
              <div *ngIf="brother.servant.christianLivingPartEnabled">
                <md-input-container fxFlex >
                  <input mdInput [mdDatepicker]="dateChristianLivingPart" [(ngModel)]="brother.servant.christianLivingPartDate" name="christianLivingPartDate"  placeholder="Data ultimo parte Vita cristiana">
                  <button mdSuffix [mdDatepickerToggle]="dateChristianLivingPart"></button>
                </md-input-container>
                <md-datepicker #dateChristianLivingPart></md-datepicker>
              </div>
            </div>


            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.servant.talkEnabled" name="talkEnabled" >
                      Discorso Tesori
                  </md-checkbox>
                  <div *ngIf="brother.servant.talkEnabled">
                    <md-input-container fxFlex >
                      <input mdInput [mdDatepicker]="dateTalk" [(ngModel)]="brother.servant.talkDate" name="gems"  placeholder="Data ultimo discorso">
                      <button mdSuffix [mdDatepickerToggle]="dateTalk"></button>
                    </md-input-container>
                    <md-datepicker #dateTalk></md-datepicker>
                  </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.servant.gemsEnabled" name="gemsEnabled" >
                      Gemme spirituali
                  </md-checkbox>

              <div *ngIf="brother.servant.gemsEnabled">
                <md-input-container fxFlex >
                  <input mdInput [mdDatepicker]="dateGems" [(ngModel)]="brother.servant.gemsDate" name="talk" placeholder="Data ultime gemme spirituali">
                  <button mdSuffix [mdDatepickerToggle]="dateGems"></button>
                </md-input-container>
                <md-datepicker #dateGems></md-datepicker>
              </div>
            </div>

           </div>

            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" md-button
                    (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" md-raised-button [disabled]="!form.form.valid"
                  (click)="dialogRef.close(brother)">Salva</button>

            </div>
      </div>
    </form>
    `,
})
export class NewServantDialog {

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public edit: boolean;
  public loading;

  constructor(public dialogRef: MdDialogRef<NewServantDialog>, private brotherService:BrotherService) {


  }

  ngOnInit(){
    if(!this.edit){
      this.loading = true;
      this.brotherService.get()
        .subscribe(list => {
          if(list && list.length > 0){
            this.brotherList = list.filter(b => !b.servant && !b.elder && b.gender == 'M');
            this.brotherListFiltered = [].concat(this.brotherList);
          }else{
            this.dialogRef.close();
            // this.dialogService.showError("Nessun fratello presente")
          }
          this.loading = false;
        })
    }
  }

  newServant(b){
    // if(this.brother && this.brother.servant)
    if(b)
     b.servant = new Servant()
  }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
