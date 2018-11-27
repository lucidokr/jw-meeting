import {
  Component, OnInit
} from '@angular/core';
import * as moment from 'moment';
import { Congregation } from 'app/shared/models/congregation.model';
import { EmitterService } from 'app/services/emitter.service';
import { CongregationService } from 'app/services/congregation.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';


@Component({
  selector: 'settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent{
  public days = []
  public congregation: Congregation = null;
  public snackBarConfig : MdSnackBarConfig = new MdSnackBarConfig();


  constructor(private emitterService: EmitterService,private congregationService:CongregationService,
    public snackBar: MdSnackBar) {
    this.days = moment.weekdays(true)
    this.congregation = JSON.parse(localStorage.getItem("user")).congregation;

    this.emitterService.get("change_header_subtitle")
      .emit('Impostazioni');

    this.snackBarConfig.duration = 5000;
  }

  public save(){
    this.congregationService.updateCongregation(this.congregation).subscribe(res => {
      this.snackBar.open("Impostazioni modificate", null, this.snackBarConfig);
    },err => {
      this.snackBar.open("Errore nella modifica delle impostazioni", null, this.snackBarConfig);
    })
  }




}
