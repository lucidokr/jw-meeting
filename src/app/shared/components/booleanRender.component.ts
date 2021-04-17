import { Component, Input } from '@angular/core';

@Component({
  selector: 'boolean-render',
  template: `
    <i *ngIf="checked" style="color:green; font-size:20px;" class="fa fa-check" aria-hidden="true"></i>
    <i *ngIf="!checked" style="color:red;font-size:20px;" class="fa fa-times" aria-hidden="true"></i>
  `,
})
export class BooleanRenderComponent {
  @Input() checked: any;
}
