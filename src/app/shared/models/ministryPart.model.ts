import { Brother } from "./brother.model";

export class MinistryPart {
  primarySchool: SchoolMinistryPart;
  secondarySchool: SchoolMinistryPart;
  html: String;
  forStudent: Boolean;
  isTalk: Boolean;
}

export class SchoolMinistryPart {
    student: Brother = null;
    assistant:  Brother = null;
    updated: Boolean = false;
    made: Number = 0;
    gender: String = '';
}

