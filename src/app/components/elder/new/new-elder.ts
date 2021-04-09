import { MatDialogRef } from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';
import {Prayer} from "../../../shared/models/prayer.model";
import {Elder} from "../../../shared/models/elder.model";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import {DialogService} from "../../../services/dialog.service";

@Component({
  selector: 'new-elder-dialog',
  styles: ['.mat-checkbox { margin-right: 22px; }'],
  template: `
    <form #form="ngForm" fxLayout="column" fxLayoutAlign="center center" >
      <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center">
          <div *ngIf="!loading && brotherList && brotherList.length>0 && !edit">
            <mat-input-container fxFlex class="brother-autocomplete">
              <input type="text" matInput [mdAutocomplete]="auto" [(ngModel)]="brother" (ngModelChange)="filterBrother($event)" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" name="brother" placeholder="Seleziona fratello">
            </mat-input-container>
            <mat-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <mat-option (onSelectionChange)="newElder(b)" *ngFor="let b of brotherListFiltered" [value]="b">
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
          <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" *ngIf="brother && brother.elder">
            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.elder.serviceOverseer" name="serviceOverseer" >
                      Sorvegliante del servizio
              </mat-checkbox>
              <mat-checkbox fxFlex [(ngModel)]="brother.elder.schoolOverseer" name="schoolOverseer" >
                      Sorvegliante della scuola
              </mat-checkbox>

            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.elder.presidentEnabled" name="presidentEnabled" >
                      Presidente
              </mat-checkbox>
                <div *ngIf="brother.elder.presidentEnabled">
                  <mat-input-container fxFlex  >
                    <input matInput [mdDatepicker]="datePresident" [(ngModel)]="brother.elder.presidentDate" name="president" placeholder="Data ultimo presidente">
                    <button mdSuffix [mdDatepickerToggle]="datePresident"></button>
                  </mat-input-container>
                  <mat-datepicker #datePresident></mat-datepicker>
                </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.elder.bibleStudyEnabled" name="bibleStudyEnabled" >
                      Studio biblico di congregazione
              </mat-checkbox>
                <div *ngIf="brother.elder.bibleStudyEnabled">
                  <mat-input-container fxFlex  >
                    <input matInput [mdDatepicker]="dateBibleStudy" [(ngModel)]="brother.elder.bibleStudyDate" name="bibleStudy" placeholder="Data ultimo studio biblico">
                    <button mdSuffix [mdDatepickerToggle]="dateBibleStudy"></button>
                  </mat-input-container>
                  <mat-datepicker #dateBibleStudy></mat-datepicker>
                </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.elder.christianLivingPartEnabled" name="christianLivingPartEnabled" >
                      Parti Vita Cristiana
                  </mat-checkbox>
              <div *ngIf="brother.elder.christianLivingPartEnabled">
                <mat-input-container fxFlex >
                  <input matInput [mdDatepicker]="dateChristianLivingPart" [(ngModel)]="brother.elder.christianLivingPartDate" name="christianLivingPartDate"  placeholder="Data ultimo parte Vita cristiana">
                  <button mdSuffix [mdDatepickerToggle]="dateChristianLivingPart"></button>
                </mat-input-container>
                <mat-datepicker #dateChristianLivingPart></mat-datepicker>
              </div>
            </div>


            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.elder.talkEnabled" name="talkEnabled" >
                      Discorso Tesori
                  </mat-checkbox>
              <div *ngIf="brother.elder.talkEnabled">
                <mat-input-container fxFlex >
                  <input matInput [mdDatepicker]="dateTalk" [(ngModel)]="brother.elder.talkDate" name="talk"  placeholder="Data ultimo discorso">
                  <button mdSuffix [mdDatepickerToggle]="dateTalk"></button>
                </mat-input-container>
                <mat-datepicker #dateTalk></mat-datepicker>
              </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <mat-checkbox fxFlex [(ngModel)]="brother.elder.gemsEnabled" name="gemsEnabled" >
                      Gemme spirituali
                  </mat-checkbox>
              <div *ngIf="brother.elder.gemsEnabled">
                <mat-input-container fxFlex >
                  <input matInput [mdDatepicker]="dateGems" [(ngModel)]="brother.elder.gemsDate" name="gems" placeholder="Data ultime gemme spirituali">
                  <button mdSuffix [mdDatepickerToggle]="dateGems"></button>
                </mat-input-container>
                <mat-datepicker #dateGems></mat-datepicker>
              </div>
            </div>

          </div>

            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" md-button
                    (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" mat-raised-button [disabled]="!form.form.valid"
                  (click)="dialogRef.close(brother)">Salva</button>

            </div>
      </div>
    </form>
    `,
})
export class NewElderDialog implements OnInit{

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public edit: boolean;
  public loading;

  constructor(public dialogRef: MatDialogRef<NewElderDialog>, private brotherService:BrotherService) {


  }

  ngOnInit(){
    if(!this.edit){
      this.loading = true;
      this.brotherService.get()
        .subscribe(list => {

          if(list && list.length > 0){
            this.brotherList = list.filter(b => !b.elder && b.gender == 'M')
            this.brotherListFiltered = [].concat(this.brotherList)
          }else{
            this.dialogRef.close();
            // this.dialogService.showError("Nessun fratello presente")
          }
          this.loading = false;
        })
    }
  }

  newElder(b){
    if(b)
      b.elder = new Elder()
  }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
