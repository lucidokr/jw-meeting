import {Component, Input, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, HostListener, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';


@Component({
  selector: 'material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss']
})
export class MaterialTableComponent implements OnChanges {
  @ViewChild('searchInput') searchInput: ElementRef;
  @Input() tableTitle: string;
  @Input() data: Array<any>;
  rows: Array<any> = [];
  @Input() noRowsAlert: string;
  initialColumns: Array<MaterialTableColumn> = [];
  columns: Array<MaterialTableColumn> = [];
  @Input() columnsToHide: Array<string>;
  @Input() columnsToShow : BreakpointsColumns = new BreakpointsColumns();
  @Input() actionColumn: string;
  @Input() rowAction: (id: number) => void;
  @Input() actionSelector: (element: any) => string;
  // @Input() sortFunction: (data: any[], column: string, direction: boolean) => any[];
  currentSorting: SortingInfo = { column: '', direction: undefined };
  @Input() filterFunction: (data: any[], text: string) => any[];
  searching: boolean = false;
  filter: string = '';
  @Input() addRowFunction: () => void;
  plusButtonClass = '';

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.initTable();
  }

  initTable(): void {
    if (this.data && this.data.length) {
      let keys = Object.keys(this.data[0]);
      this.initialColumns = [];
      for (let key of keys) {
        this.initialColumns.push({ name: key, visible: true });
      }

      if (this.actionColumn && this.rowAction) {
        this.initialColumns.push({ name: this.actionColumn, visible: true });
      }
    }
    this.onResize({});
    this.rows = this.data ? this.data : [];
  }

  public orderBy(column: string, direction?: boolean): void {
    if (!this.isActionColumn({name: column, visible: true})) {
      if (typeof this.currentSorting.direction === 'undefined') {
        if (direction) {
          this.currentSorting.direction = direction;
        } else {
          this.currentSorting.direction = true;
        }
      } else if (this.currentSorting.column === column) {
        this.currentSorting.direction = !this.currentSorting.direction;
      } else {
        this.currentSorting.direction = true;
      }
      this.currentSorting.column = column;

      this.rows.sort((a: any, b: any) => {
        let result = 0;
        if ( !a[this.currentSorting.column] || a[this.currentSorting.column] < b[this.currentSorting.column]) {
          result = this.currentSorting.direction ? -1 : 1;
        } else if ( !b[this.currentSorting.column] || a[this.currentSorting.column] > b[this.currentSorting.column] ) {
          result = this.currentSorting.direction ? 1 : -1;
        }
        return result;
      });
    }
  }

  public layout: any = {
    xsBreakpoint: 600,
    smBreakpoint: 960,
    mdBreakpoint: 1280,
    lgBreakpoint: 1440,
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    switch (true) {
      case (window.innerWidth < this.layout.xsBreakpoint):
        this.filterColumns(this.columnsToShow.xs);
        break;
      case (window.innerWidth >= this.layout.xsBreakpoint && window.innerWidth < this.layout.smBreakpoint):
        this.filterColumns(this.columnsToShow.sm);
        break;
      case (window.innerWidth >= this.layout.smBreakpoint && window.innerWidth < this.layout.mdBreakpoint):
        this.filterColumns(this.columnsToShow.md);
        break;
      case (window.innerWidth >= this.layout.mdBreakpoint):
        this.filterColumns(this.columnsToShow.lg);
        break;
    }

    this.setActionButtonPosition();
  }

  private setActionButtonPosition(): void {
    setTimeout(
        () => {
          if (document.documentElement.offsetHeight > document.documentElement.clientHeight) {
            this.plusButtonClass = 'plus-button-floating';
          } else {
            switch (true) {
              case (window.innerWidth < this.layout.xsBreakpoint):
                this.plusButtonClass = 'plus-button-floating';
                break;
              case (window.innerWidth >= this.layout.xsBreakpoint && window.innerWidth < this.layout.lgBreakpoint + 60):
                this.plusButtonClass = 'plus-button-in-table';
                break;
              case (window.innerWidth >= this.layout.mdBreakpoint + 60):
                this.plusButtonClass = 'plus-button-out-table';
                break;
            }
          }
        }, 0);
  }

  private filterColumns(columnsToShow: Array<string>): void {
    this.columns = this.initialColumns.filter(
      (value) => {
        return columnsToShow.indexOf(value.name) !== -1;
      }
    );
  }



  public onFilterChange(value: string): void {
    this.rows = this.filterFunction(this.data, value);
  }

  private resetFilter(): void {
    this.filter = '';
    this.rows = this.data;

  }

  public focusSearch(): void {
    this.searching = true;
    this.searchInput.nativeElement.focus();
  }

  public leaveSearch(): void {
    if (this.searching && this.filter) {
      return;
    }
    this.searching = false;
  }

  public isSearching(): boolean {
    return this.searching || this.filter !== '';
  }

  private showColumnInHeader(column: MaterialTableColumn): boolean {
    return column.visible && this.columnsToHide.indexOf(column.name) === -1;
  }

  private showColumnInRow(column: MaterialTableColumn): boolean {
    return column.visible && this.columnsToHide.indexOf(column.name) === -1 && column.name !== this.actionColumn;
  }

  private isActionColumn(column: MaterialTableColumn): boolean {
    return column.name === this.actionColumn;
  }
}

class MaterialTableColumn {
  name: string;
  visible: boolean;
}

class SortingInfo {
  column: string;
  direction: boolean;
}

class BreakpointsColumns {
  xs: string[];
  sm: string[];
  md: string[];
  lg: string[];
}
