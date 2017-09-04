import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

import * as moment from 'moment';

@Component({
  template: `
    <i *ngIf="checked" style="color:green; font-size:20px;" class="fa fa-check" aria-hidden="true"></i>
    <i *ngIf="!checked" style="color:red;font-size:20px;" class="fa fa-times" aria-hidden="true"></i>
  `,
})
export class BooleanRenderComponent implements ViewCell, OnInit {

  checked: any;

  @Input() value: any;
  @Input() rowData: any;

  ngOnInit() {
    this.checked = this.value;
  }

}
