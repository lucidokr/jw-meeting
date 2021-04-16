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
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" fxLayoutAlign.xs="start" fxLayoutGap="20px">
          <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <mat-form-field fxFlex class="brother-autocomplete">
              <input type="text" matInput [matAutocomplete]="auto" [(ngModel)]="brother" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" (ngModelChange)="filterBrother($event)" name="brother" placeholder="Seleziona fratello">
            </mat-form-field>
            <mat-autocomplete #auto="matAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <mat-option (onSelectionChange)="newPrayer(b)" *ngFor="let b of brotherListFiltered" [value]="b">
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
          <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" *ngIf="brother && brother.prayer" fxLayoutGap="20px">
            <mat-checkbox color="primary" [(ngModel)]="brother.prayer.enabled" name="enabled" >
                    Abilitato
            </mat-checkbox>
            <mat-form-field fxFlex >
              <input matInput [matDatepicker]="date" [(ngModel)]="brother.prayer.date" name="date"  placeholder="Data ultima preghiera">
              <mat-datepicker-toggle matSuffix [for]="date"></mat-datepicker-toggle>
            </mat-form-field>
            <mat-datepicker #date></mat-datepicker>
            
          </div>
          <mat-dialog-actions>
                <button fxLayoutAlign="center center" fxLayout="column" mat-raised-button 
                (click)="dialogRef.close()">Annulla</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" mat-raised-button [disabled]="!newPrayerForm.form.valid" color="primary"
                (click)="dialogRef.close(brother)">Salva</button>
          </mat-dialog-actions>
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
