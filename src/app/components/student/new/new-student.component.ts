import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {Student} from "../../../shared/models/student.model";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import * as moment from "moment";

@Component({
  selector: 'new-student-dialog',
  styles: [],
  templateUrl: 'new-student.component.html',
})
export class NewStudentDialog implements OnInit{

  public edit: boolean;
  public enable: boolean = true;
  public enablePoint: boolean = true;

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public loading;

  ngOnInit(){
    this.checkIfAllDisabled();
    if(!this.edit){
      this.loading = true;
      this.brotherService.get()
        .subscribe(list => {

          if(list && list.length > 0){
            this.brotherList = list.filter(b => !b.student && !b.elder)
            this.brotherListFiltered = [].concat(this.brotherList)
          }else{
            this.dialogRef.close();
            // this.dialogService.showError("Nessun fratello presente")
          }
          this.loading = false;
        })
    }
  }

  newStudent(b){
    if(b){
      b.student = new Student();
      if(b.gender == 'F'){
        b.student.bibleReadingEnabled = false;
        b.student.talkEnabled = false;
      }else{
        b.student.bibleReadingEnabled = true;
        b.student.talkEnabled = false;
      }
    }
  }

  checkIfAllDisabled(){
    if(this.brother){
      if(this.brother.student.ministryPartEnabled ||
        this.brother.student.talkEnabled
      ){
        if(!this.brother.student.lastDate) this.brother.student.lastDate = moment();
        if(!this.brother.student.lastPrevDate) this.brother.student.lastPrevDate = moment();
        this.enable = true;
        // this.enablePoint = true;
      }else{
        this.enablePoint = false;
        if(this.brother.student.bibleReadingEnabled){
          if(!this.brother.student.lastDate) this.brother.student.lastDate = moment();
          if(!this.brother.student.lastPrevDate) this.brother.student.lastPrevDate = moment();
          this.enable = true
        }else{
          this.brother.student.lastDate = null;
          this.brother.student.lastPrevDate = null;
          this.enable = false;
        }
      }
    }
  }

  disableBibleReading(ev){
    if(!ev){
      this.brother.student.bibleReadingDate = null;
    }else{
      this.brother.student.bibleReadingDate = moment();
    }
  }

  constructor(public dialogRef: MdDialogRef<NewStudentDialog>, private brotherService:BrotherService) {
    // this.studyNumberService.get()
      // .subscribe(list => this.studyNumberList = list)
  }

  // copyStudyNumber(id, key){
  //   let studyNumber = this.studyNumberList.filter(studyNumber => studyNumber._id == id)[0];
  //   this.brother.student[key].number = studyNumber.number;
  //   this.brother.student[key].title = studyNumber.title;
  // }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
