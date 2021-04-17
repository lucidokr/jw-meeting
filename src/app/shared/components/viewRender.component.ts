import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';

@Component({
  template: `
    <i (click)="onClick()" class="material-icons">remove_red_eye</i>
  `,
})
export class ViewRenderComponent {

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
