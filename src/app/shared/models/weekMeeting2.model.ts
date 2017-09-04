  import {Student} from "./student.model";
  export class WeekMeeting2 {
    date: Date;
    primarySchoolEnabled: boolean;
    secondarySchoolEnabled: boolean;
    thirdSchoolEnabled: boolean;
    supervisorWeek: boolean;
    congressWeek: boolean;

    bibleReading: Student;

    initialCallPrimary: Student;
    initialCallSecondary: Student;
    initialCallThird: Student;

    returnVisitPrimary: Student;
    returnVisitSecondary: Student;
    returnVisitThird: Student;

    bibleStudyPrimary: Student;
    bibleStudySecondary: Student;
    bibleStudyThird: Student;

    talkPrimary: Student;
    talkSecondary: Student;
    talkThird: Student;

    prayer: number;

    completed: boolean

  }

