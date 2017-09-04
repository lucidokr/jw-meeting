  export class WeekMeeting {
    _id:string;
    date: any = null;
    completed: boolean = false;
    type: any = null;
    supervisor: boolean = false;
    primarySchool: boolean = true;
    secondarySchool: boolean = true;
    initialPrayer: any = null;
    finalPrayer: any = null;
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
    presentationExercise: any = {
      enabled: false,
      brother: null,
      label: ''
    };
    bibleReading: any = {
      primarySchool:{
        student: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
      },
      secondarySchool:{
        student: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
      },
      label: ''
    };
    initialCall: any = {
      primarySchool:{
        gender: '',
        student: null,
        assistant: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
      },
      secondarySchool:{
        gender: '',
        student: null,
        assistant: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
      },
      label: ''
    };
    returnVisit: any ={
      primarySchool:{
        gender: '',
        student: null,
        assistant: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
      },
      secondarySchool:{
        gender: '',
        student: null,
        assistant: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
      },
      label: ''
    };
    bibleStudy: any ={
      primarySchool:{
        gender: '',
        student: null,
        isTalk: false,
        assistant: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
      },
      secondarySchool:{
        gender: '',
        student: null,
        isTalk: false,
        assistant: null,
        updated: false,
        made:0,
        pointCompleted:false,
        pointChanged: false
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

