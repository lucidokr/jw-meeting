import * as moment from 'moment';
export class Servant {
  _id: string;
  talkEnabled: boolean = true;
  gemsEnabled: boolean = true;
  talkDate: any = moment();
  talkPrevDate: any = moment();
  gemsDate: any = moment();
  gemsPrevDate: any = moment();

  christianLivingPartEnabled: Boolean  = true;
  christianLivingPartDate: any;
  christianLivingPartPrevDate: any;

  presentationExerciseEnabled: Boolean  = true;
  presentationExerciseDate: any;
  presentationExercisePrevDate: any;
}
