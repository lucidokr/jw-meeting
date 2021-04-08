import { MatDialogRef } from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';
import {Prayer} from "../../../shared/models/prayer.model";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";

@Component({
    selector: 'new-prayer-dialog',
  styles: ['.mat-checkbox { margin-right: 22px; }'],
    template: `
    <form #newPrayerForm="ngForm" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
          <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <md-input-container fxFlex class="brother-autocomplete">
              <input type="text" mdInput [mdAutocomplete]="auto" [(ngModel)]="brother" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" (ngModelChange)="filterBrother($event)" name="brother" placeholder="Seleziona fratello">
            </md-input-container>
            <md-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <md-option (onSelectionChange)="newPrayer(b)" *ngFor="let b of brotherListFiltered" [value]="b">
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
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" *ngIf="brother && brother.prayer">
            <md-checkbox [(ngModel)]="brother.prayer.enabled" name="enabled" >
                    Abilitato
            </md-checkbox>
            <md-input-container fxFlex >
              <input mdInput [mdDatepicker]="date" [(ngModel)]="brother.prayer.date" name="date"  placeholder="Data ultima preghiera">
              <button mdSuffix [mdDatepickerToggle]="date"></button>
            </md-input-container>
            <md-datepicker #date></md-datepicker>
            
          </div>
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
                <button fxLayoutAlign="center center" fxLayout="column" md-button 
                (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" md-raised-button [disabled]="!newPrayerForm.form.valid"
                (click)="dialogRef.close(brother)">Salva</button>
          </div>
      </div>
    </form>
    `,
})
export class NewPrayerDialog implements OnInit{

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public edit: boolean;
  public loading;

  constructor(public dialogRef: MatDialogRef<NewPrayerDialog>, private brotherService:BrotherService) {


  }

  ngOnInit(){
    if(!this.edit){
      this.loading = true;
      this.brotherService.get()
        .subscribe(list => {
          if(list && list.length > 0){
            this.brotherList = list.filter(b => !b.prayer && b.gender == 'M');
            this.brotherListFiltered = [].concat(this.brotherList)
          }else{
            this.dialogRef.close();
            // this.dialogService.showError("Nessun fratello presente")
          }
          this.loading = false;
        })
    }
  }

  newPrayer(b){
    if(b)
      b.prayer = new Prayer()
  }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
