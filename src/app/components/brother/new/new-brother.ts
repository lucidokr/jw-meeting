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
            <mat-form-field fxFlex >
              <input matInput [(ngModel)]="brother.name" name="name" placeholder="Nome" required>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field fxFlex >
              <input matInput [(ngModel)]="brother.surname" name="surname" placeholder="Cognome" required>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field fxFlex >
              <input matInput [(ngModel)]="brother.email" name="email" placeholder="E-mail">
            </mat-form-field>
          </div>
          <div>
          <mat-form-field fxFlex >
            <mat-select [(ngModel)]="brother.gender" name="gender" placeholder="Sesso" required>
              <mat-option value="M">Maschio</mat-option>
              <mat-option value="F">Femmina</mat-option>
            </mat-select>
            </mat-form-field>
          </div>
          
          
          <mat-dialog-actions>
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" mat-raised-button
                    (click)="dialogRef.close()">Annulla</button>
                <button fxLayoutAlign="center center" fxLayout="column" mat-raised-button [disabled]="!form.form.valid" color="primary"
                  (click)="dialogRef.close(brother)">Salva</button>
                  
          </mat-dialog-actions>
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
