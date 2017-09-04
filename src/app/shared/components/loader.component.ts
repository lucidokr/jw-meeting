import {Component, Input, AfterViewInit} from '@angular/core';


@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() classStroke: string = "cpStroke1";
  @Input() width: number = 44;
  @Input() height: string = "44";

}
