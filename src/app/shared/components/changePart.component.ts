import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {Brother} from "../models/brother.model";

@Component({
  selector: 'change-part',
  styles: ['.newPoint { width:200px; }'],
  template: `
    <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
      <h4 fxFlex >Modifica parte</h4>
      <div [innerHTML]="part.label | safeHtml"></div>
      <div> Fratello attuale: {{part.brother.name}} {{part.brother.surname}}</div>
      <div fxLayout="row" fxLayoutGap="30px">
        <div fxFlex>Nuovo fratello:</div>
        <md-select class="newPoint" required [(ngModel)]="newBrother" name="newBrother">
          <md-option [value]="brother" *ngFor="let brother of list">{{brother.name}} {{brother.surname}}
            <span *ngIf="brother.servant && brother.servant[t+'Date']"> - {{brother.servant[t+'Date'].format('DD/MM/YY')}}</span>
            <span *ngIf="brother.elder && brother.elder[t+'Date']"> - {{brother.elder[t+'Date'].format('DD/MM/YY')}}</span>
          </md-option>
        </md-select>
      </div>
      <div fxLayout="row" fxLayoutGap="30px">
        <button md-raised-button 
                  (click)="dialogRef.close()">Annulla</button>
        <button md-raised-button  [disabled]="!newBrother"
                  (click)="dialogRef.close(newBrother)">Modifica</button>
      </div>
    </div>
    `,
})
export class ChangePartDialog implements OnInit{

  public part: any;
  public list: Array<Brother>;
  public t: string;

  public newBrother: Brother;


  constructor(public dialogRef: MdDialogRef<ChangePartDialog> ) {

  }

  ngOnInit(){
  }




}
