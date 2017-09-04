
import {Servant} from "./servant.model";
import {Elder} from "./elder.model";
import {Student} from "./student.model";
import {Prayer} from "./prayer.model";
import {Reader} from "./reader.model";
import {Congregation} from "./congregation.model";

export class Brother {
  _id:string;
  name: string;
  surname: string;
  gender: string = '';
  email: string;
  servant: Servant;
  elder: Elder;
  student: Student;
  prayer: Prayer;
  reader: Reader;
  congregation: Congregation;
}
