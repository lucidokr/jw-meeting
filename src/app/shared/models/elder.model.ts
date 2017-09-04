
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
  gemsDate: any = moment();
  presidentDate: any = moment();
  bibleStudyDate: any = moment();


}
