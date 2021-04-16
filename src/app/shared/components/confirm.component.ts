/**
 * Created by lucidokr on 19/06/17.
 */
import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  template: `
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
          <div>{{message}}</div>
            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start" fxLayoutGap="20px">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" mat-raised-button 
                    (click)="dialogRef.close(false)">Annulla</button>
                <button fxLayoutAlign="center center" fxLayout="column" mat-raised-button color="primary"
                  (click)="dialogRef.close(true);">Conferma</button>
                  
            </div>
      </div>
    `,
})
export class ConfirmDialog {

  message: string = "Confermi?";

  constructor(public dialogRef: MatDialogRef<ConfirmDialog>) {
  }
}
