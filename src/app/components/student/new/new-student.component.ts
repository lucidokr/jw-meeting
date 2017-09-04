import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {Student} from "../../../shared/models/student.model";
import {StudyNumber} from "../../../shared/models/studyNumber.model";
import {StudyNumberService} from "../../../services/study-number.service";
import {Brother} from "../../../shared/models/brother.model";
import {BrotherService} from "../../../services/brother.service";
import * as moment from "moment";

@Component({
  selector: 'new-student-dialog',
  styles: [],
  templateUrl: 'new-student.component.html',
})
export class NewStudentDialog implements OnInit{

  public studyNumberList: Array<StudyNumber>;
  public edit: boolean;
  public enable: boolean = true;
  public enablePoint: boolean = true;

  public brother: Brother;
  public brotherList: Array<Brother>;
  public brotherListFiltered: Array<Brother>;
  public loading;

  ngOnInit(){
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
        b.student.bibleReadingStudyNumber = null;
        b.student.talkEnabled = false;
      }else{
        b.student.bibleReadingEnabled = true;
        b.student.bibleReadingStudyNumber = new StudyNumber();
        b.student.talkEnabled = false;
      }
    }
  }

  checkIfAllDisabled(){
    if(this.brother.student.initialCallEnabled ||
      this.brother.student.returnVisitEnabled ||
      this.brother.student.bibleStudyEnabled ||
      this.brother.student.talkEnabled
    ){
      if(!this.brother.student.studyNumber) this.brother.student.studyNumber = new StudyNumber();
      if(!this.brother.student.lastDate) this.brother.student.lastDate = moment();
      if(!this.brother.student.lastPrevDate) this.brother.student.lastPrevDate = moment();
      this.enable = true;
      this.enablePoint = true;
    }else{
      this.brother.student.studyNumber = null;
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

  disableBibleReading(ev){
    if(!ev){
      this.brother.student.bibleReadingStudyNumber = null;
      this.brother.student.bibleReadingDate = null;
      this.brother.student.bibleReadingPendingStudyNumber = null;
    }else{
      this.brother.student.bibleReadingStudyNumber = new StudyNumber();
      this.brother.student.bibleReadingDate = moment();
      this.brother.student.bibleReadingPendingStudyNumber = new StudyNumber();
    }
  }

  constructor(public dialogRef: MdDialogRef<NewStudentDialog>, private studyNumberService: StudyNumberService, private brotherService:BrotherService) {
    this.studyNumberService.get()
      .subscribe(list => this.studyNumberList = list)
  }

  copyStudyNumber(id, key){
    let studyNumber = this.studyNumberList.filter(studyNumber => studyNumber._id == id)[0];
    this.brother.student[key].number = studyNumber.number;
    this.brother.student[key].title = studyNumber.title;
  }

  filterBrother(ev){
    if(typeof ev == "string")
      this.brotherListFiltered = this.brotherList.filter(b => b.name.toUpperCase().indexOf(ev.toUpperCase())!=-1 || b.surname.toUpperCase().indexOf(ev.toUpperCase())!=-1)
  }
}
