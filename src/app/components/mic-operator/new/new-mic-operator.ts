import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import {MicOperator} from "../../../shared/models/mic-operator.model";

@Component({
    selector: 'mic-operator-dialog',
  styles: ['.mat-checkbox { margin-right: 22px; }'],
    template: `
    <form #newMicOperatorForm="ngForm" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
          <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <md-input-container fxFlex class="brother-autocomplete">
              <input type="text" mdInput [mdAutocomplete]="auto" [(ngModel)]="brother" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" (ngModelChange)="filterBrother($event)" name="brother" placeholder="Seleziona fratello">
            </md-input-container>
            <md-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <md-option (onSelectionChange)="newMicOperator(b)" *ngFor="let b of brotherListFiltered" [value]="b">
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
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" *ngIf="brother && brother.micOperator">
            <md-checkbox [(ngModel)]="brother.micOperator.enabled" name="enabled" >
                    Abilitato
            </md-checkbox>
            <md-input-container fxFlex >
              <input mdInput [mdDatepicker]="date" [(ngModel)]="brother.micOperator.date" name="date"  placeholder="Data ultimo microfonista">
              <button mdSuffix [mdDatepickerToggle]="date"></button>
            </md-input-container>
            <md-datepicker #date></md-datepicker>
            
          </div>
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" *ngIf="brother && brother.micOperator">
            <md-checkbox [(ngModel)]="brother.micOperator.podium" name="podium" >
                    Podio
            </md-checkbox>
            <md-checkbox [(ngModel)]="brother.micOperator.left" name="sx" >
                    Sinistra
            </md-checkbox>
            <md-checkbox [(ngModel)]="brother.micOperator.center" name="center" >
                    Centro
            </md-checkbox>
            <md-checkbox [(ngModel)]="brother.micOperator.right" name="dx" >
                    Destra
            </md-checkbox>
            
          </div>
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
                <button fxLayoutAlign="center center" fxLayout="column" md-button 
                (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" md-raised-button [disabled]="!newMicOperatorForm.form.valid"
                (click)="dialogRef.close(brother)">Salva</button>
          </div>
      </div>
    </form>
    `,
})
export class MicOperatorDialog implements OnInit{

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public edit: boolean;
  public loading;

  constructor(public dialogRef: MdDialogRef<MicOperatorDialog>, private brotherService:BrotherService) {


  }

  ngOnInit(){
    if(!this.edit){
      this.loading = true;
      this.brotherService.get()
        .subscribe(list => {
          if(list && list.length > 0){
            this.brotherList = list.filter(b => !b.micOperator && b.gender == 'M');
            this.brotherListFiltered = [].concat(this.brotherList)
          }else{
            this.dialogRef.close();
            // this.dialogService.showError("Nessun fratello presente")
          }
          this.loading = false;
        })
    }
  }

  newMicOperator(b){
    if(b)
      b.micOperator = new MicOperator()
  }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
