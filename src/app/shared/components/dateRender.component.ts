import { Component, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'date-render',
  template: `
    {{renderValue}}
  `,
})
export class DateRenderComponent{

  renderValue: any;

  @Input() date: any;

  ngOnInit() {
    if(this.date)
      this.renderValue = moment(this.date).format("D MMM YYYY");
    else
      this.renderValue = '-';
  }

}
