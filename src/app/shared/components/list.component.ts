import { Component, ViewChild, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {DialogService} from "../../services/dialog.service";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'list',
  template: ``
})
export class GeneralListComponent<T> implements OnInit{
  
  type = '';
  dialogMethod = null;
  service = null;
  data = [];
  loading: boolean;
  snackBarConfig : MatSnackBarConfig = new MatSnackBarConfig();



  /** NEW */
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T>;
  private paginator: MatPaginator;
  private sort: MatSort;
  @ViewChild(MatSort, {
    static: false
  }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setPaginationAndSort();
  }
  @ViewChild(MatPaginator, {
    static: false
  }) set matPaginator(
    mp: MatPaginator
  ) {
    this.paginator = mp;
    this.setPaginationAndSort();
  }

  public constructor(
                            public dialogService: DialogService,
                           public router:Router,
                           public snackBar: MatSnackBar) {

    this.snackBarConfig.duration = 3000;

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<T>();
  }

  setPaginationAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public load() : void{
    this.loading = true;
    this.service.get().subscribe(res => {
      this.loading = false;
      this.dataSource.data = res;
    }, err=> {
      this.loading = false;
    })
  }

  public edit(data) : void{
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

  public add() : void{
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

  public delete(data, confirm:boolean = false) : void{
    if(!confirm)
      this.dialogService.confirm("Confermi?").subscribe(confirm => {if(confirm) this.delete(data, true)});
    else{
      this.service.delete(data._id).subscribe(id =>{
        this.snackBar.open(this.type+" eliminato", null, this.snackBarConfig);
        this.load();
      });
    }
  }

  public show(data) : void{
    this.router.navigateByUrl(location.pathname + "/" + data._id)
  }

  public onSearch(query: any = '') {
    this.dataSource.filter = query;
  }
}

