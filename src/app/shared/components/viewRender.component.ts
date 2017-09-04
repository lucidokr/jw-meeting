import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

import * as moment from 'moment';

@Component({
  template: `
    <i (click)="onClick()" class="material-icons">remove_red_eye</i>
  `,
})
export class ViewRenderComponent implements ViewCell, OnInit {

  checked: any;

  @Input() value: any;
  @Input() rowData: any;

  @Output() view: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.checked = this.value;
  }

  onClick() {
    this.view.emit(this.rowData);
  }
}
