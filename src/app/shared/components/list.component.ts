import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {DialogService} from "../../services/dialog.service";
import {LocalDataSource} from "ng2-smart-table";

@Component({
  selector: 'list',
  template: ``
})
export class GeneralListComponent {
  model = {
    noDataMessage: '',
    columns: null,
    mode: 'external',
    editable:false,
    hideSubHeader:true,
    pager:{
      display:true,
      perPage:25
    },
    actions:{
      columnTitle: "Azioni",
      add:true,
      position: 'right',
      custom: []
    },
    edit:{
      editButtonContent: '<i class="material-icons">mode_edit</i>'
    },
    delete:{
      deleteButtonContent: '<i class="material-icons">delete</i>'
    },
    show:{
      enabled:false
    }
  };
  type = '';
  baseModel = null;
  dialogMethod = null;
  service = null;
  data = [];
  source: any = new LocalDataSource(this.data);
  loading: boolean;

  snackBarConfig : MdSnackBarConfig = new MdSnackBarConfig();

  public constructor(
                            public dialogService: DialogService,
                           public router:Router,
                           public snackBar: MdSnackBar) {

    this.snackBarConfig.duration = 3000;

  }

  public load():void{
    this.loading = true;
    this.service.get().subscribe(res => {
      this.loading = false;
      this.data = res;
      this.source = new LocalDataSource(this.data);
    }, err=> {
      this.loading = false;
    })
  }

  public edit(ev):void{
    let data = {...ev.data};
    // for(let key in data){
    //   if(key.indexOf("date")!=-1 || key.indexOf("Date")!=-1){
    //     data[key] = ev.data[key]._d;
    //   }
    // }
    this.dialogMethod(data, true)
      .subscribe(obj =>{
        if(obj != null){
          this.service.edit(obj).subscribe(id =>{
            this.snackBar.open(this.type+" modificato", null, this.snackBarConfig);
            this.load();
          });
        }
      });
  }

  public add():void{
    this.dialogMethod(null, false)
      .subscribe(obj =>{
        if(obj != null){
          this.service.add(obj).subscribe(id =>{
            this.snackBar.open(this.type+" aggiunto", null, this.snackBarConfig);
            this.load();
          });
        }
      });
  }

  public delete(ev, confirm:boolean = false):void{
    if(!confirm)
      this.dialogService.confirm("Confermi?").subscribe(confirm => {if(confirm) this.delete(ev, true)});
    else{
      this.service.delete(ev.data._id).subscribe(id =>{
        this.snackBar.open(this.type+" eliminato", null, this.snackBarConfig);
        this.load();
      });
    }
  }

  public show(ev):void{
    this.router.navigateByUrl(location.pathname + "/" + ev.data._id)
  }

  public onSearch(query: any = '') {
    if(query && query.length>0){
      console.log(query);
      this.source.setFilter([
        {
          field: 'name',
          search: query
        },
        {
          field: 'surname',
          search: query
        }
      ], false);
    }else{
      this.source.reset();
    }
  }
}

