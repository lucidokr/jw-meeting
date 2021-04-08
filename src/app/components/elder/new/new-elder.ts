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
            <md-input-container fxFlex class="brother-autocomplete">
              <input type="text" mdInput [mdAutocomplete]="auto" [(ngModel)]="brother" (ngModelChange)="filterBrother($event)" [value]="(brother && brother.name && brother.surname ? brother.name + ' '+brother.surname: '')" name="brother" placeholder="Seleziona fratello">
            </md-input-container>
            <md-autocomplete #auto="mdAutocomplete"  name="brotherAutocomplete" placeholder="Seleziona fratello">
               <md-option (onSelectionChange)="newElder(b)" *ngFor="let b of brotherListFiltered" [value]="b">
                  {{b.surname}} {{b.name}}
               </md-option>
            </md-autocomplete>
          </div>
          <div *ngIf="!loading && brotherList && brotherList.length == 0 && !edit">
            Nessun fratello da aggiungere
          </div>
          <div *ngIf="brother && edit" fxFlex>
            <h3>{{brother.name}} {{brother.surname}}</h3>
          </div>
          <div class="flex-container"  fxLayout="column" fxLayoutAlign="center center" *ngIf="brother && brother.elder">
            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.elder.serviceOverseer" name="serviceOverseer" >
                      Sorvegliante del servizio
              </md-checkbox>
              <md-checkbox fxFlex [(ngModel)]="brother.elder.schoolOverseer" name="schoolOverseer" >
                      Sorvegliante della scuola
              </md-checkbox>

            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.elder.presidentEnabled" name="presidentEnabled" >
                      Presidente
              </md-checkbox>
                <div *ngIf="brother.elder.presidentEnabled">
                  <md-input-container fxFlex  >
                    <input mdInput [mdDatepicker]="datePresident" [(ngModel)]="brother.elder.presidentDate" name="president" placeholder="Data ultimo presidente">
                    <button mdSuffix [mdDatepickerToggle]="datePresident"></button>
                  </md-input-container>
                  <md-datepicker #datePresident></md-datepicker>
                </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.elder.bibleStudyEnabled" name="bibleStudyEnabled" >
                      Studio biblico di congregazione
              </md-checkbox>
                <div *ngIf="brother.elder.bibleStudyEnabled">
                  <md-input-container fxFlex  >
                    <input mdInput [mdDatepicker]="dateBibleStudy" [(ngModel)]="brother.elder.bibleStudyDate" name="bibleStudy" placeholder="Data ultimo studio biblico">
                    <button mdSuffix [mdDatepickerToggle]="dateBibleStudy"></button>
                  </md-input-container>
                  <md-datepicker #dateBibleStudy></md-datepicker>
                </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.elder.christianLivingPartEnabled" name="christianLivingPartEnabled" >
                      Parti Vita Cristiana
                  </md-checkbox>
              <div *ngIf="brother.elder.christianLivingPartEnabled">
                <md-input-container fxFlex >
                  <input mdInput [mdDatepicker]="dateChristianLivingPart" [(ngModel)]="brother.elder.christianLivingPartDate" name="christianLivingPartDate"  placeholder="Data ultimo parte Vita cristiana">
                  <button mdSuffix [mdDatepickerToggle]="dateChristianLivingPart"></button>
                </md-input-container>
                <md-datepicker #dateChristianLivingPart></md-datepicker>
              </div>
            </div>


            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.elder.talkEnabled" name="talkEnabled" >
                      Discorso Tesori
                  </md-checkbox>
              <div *ngIf="brother.elder.talkEnabled">
                <md-input-container fxFlex >
                  <input mdInput [mdDatepicker]="dateTalk" [(ngModel)]="brother.elder.talkDate" name="talk"  placeholder="Data ultimo discorso">
                  <button mdSuffix [mdDatepickerToggle]="dateTalk"></button>
                </md-input-container>
                <md-datepicker #dateTalk></md-datepicker>
              </div>
            </div>

            <div fxLayout="row" fxLayoutAlign="start center">
              <md-checkbox fxFlex [(ngModel)]="brother.elder.gemsEnabled" name="gemsEnabled" >
                      Gemme spirituali
                  </md-checkbox>
              <div *ngIf="brother.elder.gemsEnabled">
                <md-input-container fxFlex >
                  <input mdInput [mdDatepicker]="dateGems" [(ngModel)]="brother.elder.gemsDate" name="gems" placeholder="Data ultime gemme spirituali">
                  <button mdSuffix [mdDatepickerToggle]="dateGems"></button>
                </md-input-container>
                <md-datepicker #dateGems></md-datepicker>
              </div>
            </div>

          </div>

            <div class="flex-container"  fxLayout="row" fxLayoutAlign="center center" fxLayoutAlign.xs="start">
              <button fxLayoutAlign="center center" color="accent" fxLayout="column" md-button
                    (click)="dialogRef.close()">Annula</button>
                <button fxLayoutAlign="center center" *ngIf="edit || (!edit && brotherList && brotherList.length > 0)" fxLayout="column" md-raised-button [disabled]="!form.form.valid"
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
