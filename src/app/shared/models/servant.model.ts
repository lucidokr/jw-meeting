import * as moment from 'moment';
export class Servant {
  _id: string;
  talkEnabled: boolean = true;
  gemsEnabled: boolean = true;
  talkDate: any = moment();
  gemsDate: any = moment();
}
