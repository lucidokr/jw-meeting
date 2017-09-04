/**
 * Created by lucidokr on 19/06/17.
 */
import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'error-dialog',
  template: `
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center">
          {{message}}
            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              
                <button fxLayoutAlign="center center" fxLayout="column" md-raised-button
                  (click)="dialogRef.close()">OK</button>
                  
            </div>
      </div>
    `,
})
export class ErrorDialog {

  message:string;

  constructor(public dialogRef: MdDialogRef<ErrorDialog>) {
  }


}
