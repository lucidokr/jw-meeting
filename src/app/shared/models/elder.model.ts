
import * as moment from 'moment';
import {Brother} from "./brother.model";
export class Elder {
  _id:string;
  talkEnabled: boolean = true;
  gemsEnabled: boolean = true;
  presidentEnabled: boolean = true;
  serviceOverseer: boolean = false;
  schoolOverseer: boolean = false;
  bibleStudyEnabled: boolean = false;
  talkDate: any = moment();
  talkPrevDate: any = moment();
  gemsDate: any = moment();
  gemsPrevDate: any = moment();
  presidentDate: any = moment();
  presidentPrevDate: any = moment();
  bibleStudyDate: any = moment();
  bibleStudyPrevDate: any = moment();

  christianLivingPartEnabled: Boolean  = true;
  christianLivingPartDate: any;
  christianLivingPartPrevDate: any;

  presentationExerciseEnabled: Boolean  = true;
  presentationExerciseDate: any;
  presentationExercisePrevDate: any;


}
