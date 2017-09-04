import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

import * as moment from 'moment';

@Component({
  template: `
    {{renderValue}}
  `,
})
export class DateRenderComponent implements ViewCell, OnInit {

  renderValue: any;

  @Input() value: any;
  @Input() rowData: any;

  ngOnInit() {
    if(this.value)
      this.renderValue = moment(this.value).format("D MMM YYYY");
    else
      this.renderValue = '-';
  }

}
