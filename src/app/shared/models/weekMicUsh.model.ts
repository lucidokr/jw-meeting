import { Brother } from "app/shared/models/brother.model";

  export class WeekMicUsh {
    _id:string;
    date: any = null;
    type: any = null;
    usher: Array<Brother>;
    micOperator: Array<Brother>;
    acoustic: Brother;
  }

