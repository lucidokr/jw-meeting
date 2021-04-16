import { MatDialogRef } from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';
import {Brother} from "../models/brother.model";

@Component({
  selector: 'change-part',
  styles: ['.newPoint { width:200px; }'],
  template: `
    <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
      <h4 fxFlex >Modifica parte</h4>
      <div [innerHTML]="part.label | safeHtml"></div>
      <div class="separator"></div>
      <div fxLayout="row" fxFlexFill fxLayoutAlign="center center">
        <span fxFlex="30">Attuale:</span>
        <div fxFlex="70" *ngIf="!part.president">  {{part.brother.name}} {{part.brother.surname}}</div>
        <div fxFlex="70" *ngIf="part.president"> Svolta dal presidente</div>
      </div>
      <div fxLayout="row" fxFlexFill fxLayoutAlign="center center">
        <div fxFlex="30">Nuovo:</div>
        <mat-form-field fxFlex="70">
          <mat-select required [(ngModel)]="newBrother" name="newBrother">
            <mat-option [value]="brother" *ngFor="let brother of list">{{brother.name}} {{brother.surname}}
              <span *ngIf="brother.servant && brother.servant[t+'Date']"> - {{brother.servant[t+'Date'].format('DD/MM/YY')}}</span>
              <span *ngIf="brother.elder && brother.elder[t+'Date']"> - {{brother.elder[t+'Date'].format('DD/MM/YY')}}</span>
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div fxLayout="row" fxLayoutGap="30px">
        <button mat-raised-button 
                  (click)="dialogRef.close()">Annulla</button>
        <button mat-raised-button  [disabled]="!newBrother"
                  (click)="dialogRef.close(newBrother)" color="primary">Modifica</button>
      </div>
    </div>
    `,
})
export class ChangePartDialog implements OnInit{

  public part: any;
  public list: Array<Brother>;
  public t: string;

  public newBrother: Brother;


  constructor(public dialogRef: MatDialogRef<ChangePartDialog> ) {

  }

  ngOnInit(){
  }




}
