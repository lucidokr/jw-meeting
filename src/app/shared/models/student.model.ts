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

    talkEnabled: boolean = true;
    talkDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    talkPrevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    talkLastSchool: number = 1;
    talkLastPrevSchool: number = 1;

    assistantEnabled: boolean = true;
    assistantDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    assistantLastSchool: number = 1;

    // AFTER 2019
    ministryPartEnabled: boolean = true;
    ministryPartPrevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    ministryPartDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
    ministryPartLastSchool: number = 1;
    ministryPartLastPrevSchool: number = 1;


  }


