
import {Servant} from "./servant.model";
import {Elder} from "./elder.model";
import {Student} from "./student.model";
import {Prayer} from "./prayer.model";
import {Reader} from "./reader.model";
import {Congregation} from "./congregation.model";
import {Acoustics} from "./acoustics.model";
import {MicOperator} from "./mic-operator.model";
import {Usher} from "./usher.model";

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
  acoustics: Acoustics;
  micOperator: MicOperator;
  usher: Usher;
  congregation: Congregation;
}
