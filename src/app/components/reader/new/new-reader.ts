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
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" fxLayoutAlign.xs="start" fxLayoutGap="20px">
          <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <mat-form-field fxFlex class="brother-autocomplete">
              <input type="text" matInput [matAutocomplete]="auto" [(ngModel)]="brother" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname : '')" (ngModelChange)="filterBrother($event)" name="brother" placeholder="Seleziona fratello">
            </mat-form-field>
            <mat-autocomplete #auto="matAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
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
          <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" *ngIf="brother && brother.reader">
            <mat-checkbox color="primary" [(ngModel)]="brother.reader.enabled" name="enabled" >
                    Abilitato
            </mat-checkbox>
            <mat-form-field fxFlex >
              <input matInput [matDatepicker]="date" [(ngModel)]="brother.reader.date" name="date"  placeholder="Ultima data">
              <mat-datepicker-toggle matSuffix [for]="date"></mat-datepicker-toggle>
              <mat-datepicker #date></mat-datepicker>
            </mat-form-field>
            
          </div>
          <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start" fxLayoutGap="20px">
                <button fxLayoutAlign="center center" fxLayout="column" mat-raised-button 
                (click)="dialogRef.close()">Annulla</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" mat-raised-button [disabled]="!newReaderForm.form.valid" color="primary"
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
