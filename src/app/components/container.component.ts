import {
  Component, OnInit, Input, Inject, ElementRef, ViewChild, AfterContentChecked,
  EventEmitter, HostListener
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';
import {EmitterService} from "../services/emitter.service";
import {AuthService} from "../services/auth.service";
import {USER_ROLE} from "../constant";
import {User} from "../shared/models/user.model";

@Component({
  selector: 'container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements AfterContentChecked, OnInit {

  login:boolean = false;

  height:number;

  subtitle:string;
  sidenavOpen: boolean = false;
  headerTitleEmitter: EventEmitter<string>;

  user: User = null;
  public USER_ROLE = USER_ROLE;

  constructor(private emitterService: EmitterService, private router:Router, private authService: AuthService) {
    this.user = authService.getUser();
    router.events.subscribe((val) => {
      if(location.href.indexOf("login")==-1){
        this.user = authService.getUser();
        this.login = false;
      }else{
        this.user = authService.getUser();
        this.login = true;
      }
    });
  }

  checkLoginPage(){

  }

  openSidenav(){
    this.sidenavOpen = !this.sidenavOpen;
    return this.sidenavOpen
  }

  onScroll($event){
    console.log($event);
    console.log("scrolling");
  }

  logout(){
    this.authService.logout(true);
  }

  ngOnInit() {
    if(location.href.indexOf("login")==-1){
      this.height = window.innerHeight - 112;
      moment.locale('it');
    }else{
      this.login = true;
    }
    this.headerTitleEmitter = this.emitterService.get("change_header_subtitle");
    this.headerTitleEmitter.subscribe(subtitle => {
      this.subtitle = subtitle;
    })
  }

  ngAfterContentChecked(): void {
   }

}
