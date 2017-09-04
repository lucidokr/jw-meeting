import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../../../services/student.service";
import {Student} from "../../../shared/models/student.model";
import {Brother} from "../../../shared/models/brother.model";

@Component({
  selector: 'history-list',
  templateUrl: './list-history.component.html',
  styleUrls: ['./list-history.component.scss']
})
export class HistoryListComponent {
  public model : Array<Brother> = [];
  public loading : boolean = true;
  constructor(private studentService:StudentService, private router:Router) {
    studentService.get().subscribe(students => {
      console.log(students);
      this.model = students;
    })
  }

  showDetail(row: any): void {
    this.router.navigateByUrl(location.pathname + '/' + row.student._id);
  };


  detailIconSelector(element: any): string {
    let result = 'edit';
    return result;
  }


  filter(data: Array<any>, text: string): Array<any> {
    if (data.length === 0) {
      return [];
    }

    let result: Array<any> = new Array<any>();
    let keys = Object.keys(data[0]);
    data.forEach(
      (element: any) => {
        let found: boolean = false;
        keys.forEach(
          (key: string) => {
            if (!found && element[key] && element[key].toString().toLowerCase().indexOf(text.toLowerCase()) !== -1) {
              found = true;
            }
          }
        );
        if (found) {
          result.push(element);
        }

      }
    );

    return result;
  }


}
