import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import {Acoustics} from "../../../shared/models/acoustics.model";

@Component({
    selector: 'acoustics-dialog',
  styles: ['.mat-checkbox { margin-right: 22px; }'],
    template: `
    <form #newAcousticsForm="ngForm" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
          <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <md-input-container fxFlex class="brother-autocomplete">
              <input type="text" mdInput [mdAutocomplete]="auto" [(ngModel)]="brother" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" (ngModelChange)="filterBrother($event)" name="brother" placeholder="Seleziona fratello">
            </md-input-container>
            <md-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <md-option (onSelectionChange)="newAcoustics(b)" *ngFor="let b of brotherListFiltered" [value]="b">
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
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" *ngIf="brother && brother.acoustics">
            <md-checkbox [(ngModel)]="brother.acoustics.enabled" name="enabled" >
                    Abilitato
            </md-checkbox>
            <md-input-container fxFlex >
              <input mdInput [mdDatepicker]="date" [(ngModel)]="brother.acoustics.date" name="date"  placeholder="Data ultima acustica">
              <button mdSuffix [mdDatepickerToggle]="date"></button>
            </md-input-container>
            <md-datepicker #date></md-datepicker>
            
          </div>
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
                <button fxLayoutAlign="center center" fxLayout="column" md-button 
                (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" md-raised-button [disabled]="!newAcousticsForm.form.valid"
                (click)="dialogRef.close(brother)">Salva</button>
          </div>
      </div>
    </form>
    `,
})
export class AcousticsDialog implements OnInit{

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public edit: boolean;
  public loading;

  constructor(public dialogRef: MdDialogRef<AcousticsDialog>, private brotherService:BrotherService) {


  }

  ngOnInit(){
    if(!this.edit){
      this.loading = true;
      this.brotherService.get()
        .subscribe(list => {
          if(list && list.length > 0){
            this.brotherList = list.filter(b => !b.acoustics && b.gender == 'M');
            this.brotherListFiltered = [].concat(this.brotherList)
          }else{
            this.dialogRef.close();
            // this.dialogService.showError("Nessun fratello presente")
          }
          this.loading = false;
        })
    }
  }

  newAcoustics(b){
    if(b)
      b.acoustics = new Acoustics()
  }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
