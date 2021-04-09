import { MatDialogRef } from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import {Reader} from "../../../shared/models/reader.model";

@Component({
    selector: 'new-reader-dialog',
  styles: ['.mat-checkbox { margin-right: 22px; }'],
    template: `
    <form #newReaderForm="ngForm" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
          <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <mat-input-container fxFlex class="brother-autocomplete">
              <input type="text" matInput [mdAutocomplete]="auto" [(ngModel)]="brother" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname : '')" (ngModelChange)="filterBrother($event)" name="brother" placeholder="Seleziona fratello">
            </mat-input-container>
            <mat-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <mat-option (onSelectionChange)="newReader(b)" *ngFor="let b of brotherListFiltered" [value]="b">
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
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" *ngIf="brother && brother.reader">
            <mat-checkbox [(ngModel)]="brother.reader.enabled" name="enabled" >
                    Abilitato
            </mat-checkbox>
            <mat-input-container fxFlex >
              <input matInput [mdDatepicker]="date" [(ngModel)]="brother.reader.date" name="date"  placeholder="Data ultima preghiera">
              <button mdSuffix [mdDatepickerToggle]="date"></button>
            </mat-input-container>
            <mat-datepicker #date></mat-datepicker>
            
          </div>
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
                <button fxLayoutAlign="center center" fxLayout="column" md-button 
                (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" mat-raised-button [disabled]="!newReaderForm.form.valid"
                (click)="dialogRef.close(brother)">Salva</button>
          </div>
      </div>
    </form>
    `,
})
export class NewReaderDialog implements OnInit{

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public edit: boolean;
  public loading;

  constructor(public dialogRef: MatDialogRef<NewReaderDialog>, private brotherService:BrotherService) {


  }

  ngOnInit(){
    if(!this.edit){
      this.loading = true;
      this.brotherService.get()
        .subscribe(list => {
          if(list && list.length > 0){
            this.brotherList = list.filter(b => !b.reader && b.gender == 'M');
            this.brotherListFiltered = [].concat(this.brotherList)
          }else{
            this.dialogRef.close();
            // this.dialogService.showError("Nessun fratello presente")
          }
          this.loading = false;
        })
    }
  }

  newReader(b){
    if(b)
      b.reader = new Reader()
  }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
