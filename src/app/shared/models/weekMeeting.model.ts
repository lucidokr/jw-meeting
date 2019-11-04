import { MinistryPart } from "./ministryPart.model";

  export class WeekMeeting {
    _id:string;
    congregation: any = null;
    date: any = null;
    completed: boolean = false;
    type: any = null;
    supervisor: boolean = false;
    primarySchool: boolean = true;
    secondarySchool: boolean = true;
    initialPrayer: any = null;
    finalPrayer: any = null;
    weeklyBibleReading: string = null;
    initialSong: string;
    finalSong: string;
    intervalSong: string;
    president: any = null;
    talk: any = {
      brother: null,
      label: ''
    };
    gems: any = {
      brother: null,
      label: ''
    };

    ministryPart: Array<MinistryPart> = [];
    bibleReading: any = {
      primarySchool:{
        student: null,
        updated: false,
        made:0,
      },
      secondarySchool:{
        student: null,
        updated: false,
        made:0,
      },
      label: ''
    };
    christianLivingPart:any=[];
    congregationBibleStudy:any={
      brother: null,
      label: '',
      reader: null
    };
  }

