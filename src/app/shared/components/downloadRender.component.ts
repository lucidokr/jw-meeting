import {Component, Input, EventEmitter, Output} from '@angular/core';


@Component({
  template: `
    <i (click)="onClick()" class="material-icons">file_download</i>
  `,
})
export class DownloadRenderComponent {

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
