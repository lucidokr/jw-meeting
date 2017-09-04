import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';
import {Prayer} from "../../../shared/models/prayer.model";
import {Elder} from "../../../shared/models/elder.model";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import {DialogService} from "../../../services/dialog.service";

@Component({
  selector: 'new-brother-dialog',
  styles: ['md-input-container { width:400px; }'],
  template: `
    <form #form="ngForm" fxLayout="column" fxLayoutAlign="center center" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center">
          
          <div>
            <md-input-container fxFlex >
              <input mdInput [(ngModel)]="brother.name" name="name" placeholder="Nome" required>
            </md-input-container>
          </div>
          <div>
            <md-input-container fxFlex >
              <input mdInput [(ngModel)]="brother.surname" name="surname" placeholder="Cognome" required>
            </md-input-container>
          </div>
          <div>
            <md-input-container fxFlex >
              <input mdInput [(ngModel)]="brother.email" name="email" placeholder="E-mail">
            </md-input-container>
          </div>
          <div>
            <md-select [(ngModel)]="brother.gender" name="gender" placeholder="Sesso" required>
              <md-option value="M">Maschio</md-option>
              <md-option value="F">Femmina</md-option>
            </md-select>
          </div>
          
          
            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" md-button 
                    (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" fxLayout="column" md-raised-button [disabled]="!form.form.valid"
                  (click)="dialogRef.close(brother)">Salva</button>
                  
            </div>
      </div>
    </form>
    `,
})
export class NewBrotherDialog {

  public brother: Brother;
  public edit: boolean;

  constructor(public dialogRef: MdDialogRef<NewBrotherDialog>) {

  }
}
