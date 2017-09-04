import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

import * as moment from 'moment';

@Component({
  template: `
    <i (click)="onClick()" class="material-icons">file_download</i>
  `,
})
export class DownloadRenderComponent implements ViewCell, OnInit {

  checked: any;

  @Input() value: any;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.checked = this.value;
  }

  onClick() {
    this.save.emit(this.rowData);
  }
}
