import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  public username: string;
  public password: string;
  public message: string;


  constructor(private authService: AuthService,
              public router:Router) {

  }

  login(){
    this.authService.login(this.username, this.password).subscribe(token => {
      if(token){
        this.message = null;

        let url : any = new URL(location.href);
        let c = url.searchParams.get("returnUrl");
        if(c)
          this.router.navigateByUrl(c);
        else
          this.router.navigateByUrl("home")

      }else{
        this.message = "Username o password errati";
      }
    },err =>{
      this.message = "Username o password errati";
    })
  }




}
