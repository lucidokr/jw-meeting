  import {StudyNumber} from "./studyNumber.model";
  export class Student {

    randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    _id: string;

    lastDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    lastPrevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    lastSchool: number = 1;
    lastPrevSchool: number = 1;

    primarySchoolEnabled: boolean = true;
    secondarySchoolEnabled: boolean = true;
    thirdSchoolEnabled: boolean = true;

    bibleReadingEnabled: boolean = true;
    bibleReadingPrevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    bibleReadingDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    bibleReadingLastSchool: number = 1;
    bibleReadingLastPrevSchool: number = 1;

    initialCallEnabled: boolean = true;
    initialCallPrevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    initialCallDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    initialCallLastSchool: number = 1;
    initialCallLastPrevSchool: number = 1;

    returnVisitEnabled: boolean = true;
    returnVisitPrevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    returnVisitDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    returnVisitLastSchool: number = 1;
    returnVisitLastPrevSchool: number = 1;

    bibleStudyEnabled: boolean = true;
    bibleStudyPrevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    bibleStudyDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    bibleStudyLastSchool: number = 1;
    bibleStudyLastPrevSchool: number = 1;

    talkEnabled: boolean = true;

    assistantEnabled: boolean = true;
    assistantDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    assistantLastSchool: number = 1;

    studyNumber: StudyNumber = new StudyNumber();
    bibleReadingStudyNumber: StudyNumber = new StudyNumber();
    pendingStudyNumber: StudyNumber;
    bibleReadingPendingStudyNumber: StudyNumber;

  }


