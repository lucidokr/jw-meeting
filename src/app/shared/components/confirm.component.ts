/**
 * Created by lucidokr on 19/06/17.
 */
import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  template: `
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center">
          Confermi?
            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" md-button 
                    (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" fxLayout="column" md-raised-button
                  (click)="dialogRef.close(); callback()">Conferma</button>
                  
            </div>
      </div>
    `,
})
export class ConfirmDialog {

  callback:any;

  constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {
  }
}
