import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {StudyNumber} from "../models/studyNumber.model";
import {StudyNumberService} from "../../services/study-number.service";

declare var XLSX:any;
@Component({
  selector: 'change-number',
  styles: ['.newPoint { width:200px; }'],
  template: `
    <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
      <h4 fxFlex >Punto attuale: {{point.number}} - {{point.title}}</h4>
      <div fxLayout="row" fxLayoutGap="30px">
        <div fxFlex>Nuovo punto:</div>
        <md-select class="newPoint" required [(ngModel)]="newPoint" name="newStudyNumber">
          <md-option [value]="studyNumber" *ngFor="let studyNumber of studyNumberList | filter: 'forBibleReading' : forBibleReading">{{studyNumber.number}} - {{studyNumber.title}}</md-option>
        </md-select>
      </div>
      <div fxLayout="row" fxLayoutGap="30px">
        <button md-raised-button 
                  (click)="dialogRef.close()">Annulla</button>
        <button md-raised-button 
                  (click)="dialogRef.close(newPoint)">Modifica</button>
      </div>
    </div>
    `,
})
export class ChangeNumberDialog implements OnInit{

  public point: StudyNumber;
  public forBibleReading: boolean;
  public newPoint: StudyNumber;

  public studyNumberList: Array<StudyNumber>;


  constructor(public dialogRef: MdDialogRef<ChangeNumberDialog>, private studyNumberService:StudyNumberService ) {

    this.point = this.newPoint;
  }

  ngOnInit(){
    this.studyNumberService.get()
      .subscribe(list => this.studyNumberList = list);
  }


}
