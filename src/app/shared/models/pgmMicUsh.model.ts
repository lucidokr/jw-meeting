import { Brother } from "app/shared/models/brother.model";
import { WeekMicUsh } from "app/shared/models/weekMicUsh.model";

  export class WeekMeeting {
    _id:string;
    congregation: any = null;
    name: string = null;
    weeks: Array<WeekMicUsh>;
  }


