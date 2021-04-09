import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import {Prayer} from "../../../shared/models/prayer.model";
import {Elder} from "../../../shared/models/elder.model";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import {DialogService} from "../../../services/dialog.service";

@Component({
  selector: 'new-brother-dialog',
  styles: ['mat-form-field { width:400px; }'],
  template: `
    <form #form="ngForm" fxLayout="column" fxLayoutAlign="center center" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center">
          
          <div>
            <mat-input-container fxFlex >
              <input matInput [(ngModel)]="brother.name" name="name" placeholder="Nome" required>
            </mat-input-container>
          </div>
          <div>
            <mat-input-container fxFlex >
              <input matInput [(ngModel)]="brother.surname" name="surname" placeholder="Cognome" required>
            </mat-input-container>
          </div>
          <div>
            <mat-input-container fxFlex >
              <input matInput [(ngModel)]="brother.email" name="email" placeholder="E-mail">
            </mat-input-container>
          </div>
          <div>
            <mat-select [(ngModel)]="brother.gender" name="gender" placeholder="Sesso" required>
              <mat-option value="M">Maschio</mat-option>
              <mat-option value="F">Femmina</mat-option>
            </mat-select>
          </div>
          
          
            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" md-button 
                    (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" fxLayout="column" mat-raised-button [disabled]="!form.form.valid"
                  (click)="dialogRef.close(brother)">Salva</button>
                  
            </div>
      </div>
    </form>
    `,
})
export class NewBrotherDialog {

  public brother: Brother;
  public edit: boolean;

  constructor(public dialogRef: MatDialogRef<NewBrotherDialog>) {

  }
}
