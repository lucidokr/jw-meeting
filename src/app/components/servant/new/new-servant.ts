import { MatDialogRef } from '@angular/material/dialog';
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
            <mat-input-container fxFlex class="brother-autocomplete">
              <input type="text" matInput [mdAutocomplete]="auto" [(ngModel)]="brother" (ngModelChange)="filterBrother($event)" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" name="brother" placeholder="Seleziona fratello">
            </mat-input-container>
            <mat-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <mat-option (onSelectionChange)="newServant(b)" *ngFor="let b of brotherListFiltered" [value]="b">
                  {{b.surname}} {{b.name}}
               </mat-option>
            </mat-autocomplete>
          </div>
          <div *ngIf="!loading && brotherList && brotherList.length == 0 && !edit">
            Nessun fratello da aggiungere
          </div>
          <div *ngIf="brother && edit" fxFlex>
            <h3>{{brother.name}} {{brother.surname}}</h3>
          </div>
          <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" *ngIf="brother && brother.servant">

            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.servant.christianLivingPartEnabled" name="christianLivingPartEnabled" >
                      Parti Vita Cristiana
                  </mat-checkbox>
              <div *ngIf="brother.servant.christianLivingPartEnabled">
                <mat-input-container fxFlex >
                  <input matInput [mdDatepicker]="dateChristianLivingPart" [(ngModel)]="brother.servant.christianLivingPartDate" name="christianLivingPartDate"  placeholder="Data ultimo parte Vita cristiana">
                  <button mdSuffix [mdDatepickerToggle]="dateChristianLivingPart"></button>
                </mat-input-container>
                <mat-datepicker #dateChristianLivingPart></mat-datepicker>
              </div>
            </div>


            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.servant.talkEnabled" name="talkEnabled" >
                      Discorso Tesori
                  </mat-checkbox>
                  <div *ngIf="brother.servant.talkEnabled">
                    <mat-input-container fxFlex >
                      <input matInput [mdDatepicker]="dateTalk" [(ngModel)]="brother.servant.talkDate" name="gems"  placeholder="Data ultimo discorso">
                      <button mdSuffix [mdDatepickerToggle]="dateTalk"></button>
                    </mat-input-container>
                    <mat-datepicker #dateTalk></mat-datepicker>
                  </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.servant.gemsEnabled" name="gemsEnabled" >
                      Gemme spirituali
                  </mat-checkbox>

              <div *ngIf="brother.servant.gemsEnabled">
                <mat-input-container fxFlex >
                  <input matInput [mdDatepicker]="dateGems" [(ngModel)]="brother.servant.gemsDate" name="talk" placeholder="Data ultime gemme spirituali">
                  <button mdSuffix [mdDatepickerToggle]="dateGems"></button>
                </mat-input-container>
                <mat-datepicker #dateGems></mat-datepicker>
              </div>
            </div>

           </div>

            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" md-button
                    (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" mat-raised-button [disabled]="!form.form.valid"
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

  constructor(public dialogRef: MatDialogRef<NewServantDialog>, private brotherService:BrotherService) {


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
