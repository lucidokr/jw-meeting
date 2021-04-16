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
  templateUrl: 'new-elder.html'
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
