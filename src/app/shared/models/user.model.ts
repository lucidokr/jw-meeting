
import {Congregation} from "./congregation.model";

export class User {
  _id:string;
  username: string;
  password: string;
  role: string;
  congregation: Congregation;
}
