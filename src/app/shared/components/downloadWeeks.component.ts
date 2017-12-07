import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {WeekMeeting} from "../models/weekMeeting.model";
import * as moment from 'moment';
import {MeetingService} from "../../services/meeting.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {Brother} from "../models/brother.model";
import {CONST, CONST_LABEL} from "../../constant";

import * as he from 'he';

declare var XLSX:any;
@Component({
  selector: 'download-weeks',
  template: `
    <div fxLayout="column" fxLayoutAlign="center center">
      <span *ngIf="fromCreate">Programma correttamente creato</span>
      Vuoi scaricare il programma in formato Excel delle seguenti adunanze?
      <ul>
        <li *ngFor="let week of weeks">{{week.date.format('dddd D MMMM YYYY')}}</li>
      </ul>
      <span *ngIf="fromCreate">Il programma può anche essere scaricato successivamente dalla sezione adunanze</span>
      <span style="text-align:center;"><strong>Cliccando su Download verranno scaricati 2 file. <br><br>
      Per ottenere il programma bisogna copiare il contenuto della prima pagina del file Vita-Cristiana-Ministero-Bozza-(mese-anno).xlsx nel primo foglio del file Vita-Cristiana-Ministero-(mese-anno).xlsm <u> avendo cura di non cambiare foglio prima di aver copiato e copiare il contenuto del primo foglio dalla prima cella in alto a destra</u><br>
      <br>
      All'apertura del file bozza vi potrà dare errori voi cliccate su "Apri e ripristina" e successivamente su "Elimina". <br></strong></span>
      <div fxLayout="row" fxLayoutAlign="center center">
        <button fxFlex md-raised-button (click)="close()">Annulla</button>
        <button FxFlex md-raised-button (click)="download()">Download</button>
      </div>
    </div>
    `,
})
export class DownloadWeeksDialog implements OnInit{

  public weeks: Array<WeekMeeting>;
  public fromCreate: Boolean;
  public xls: any;

  public dateArr: Array<any> = []


  constructor(public dialogRef: MdDialogRef<DownloadWeeksDialog>, private meetingService:MeetingService, private router:Router) {
    // this.xls = XLSX.readFile('http://localhost:4200/assets/xls/pgm-vcm.xlsx')
    var url = "assets/xls/pgm-draft-vcm-2018.xlsx";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    let that = this;
    oReq.onload = function(e) {
      var arraybuffer = oReq.response;

      /* convert data to binary string */
      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");

      /* Call XLSX */
      that.xls = XLSX.read(bstr, {type:"binary", cellStyles:true});
      /* DO SOMETHING WITH workbook HERE */
    }

    oReq.send();

  }

  ngOnInit(){

  }

  download(){
    let sheets = this.xls.Sheets;
    let draft = sheets.Bozza;
    let countRow = 0;

  let PART_TYPE_ALL = ['initialCall', 'returnVisit', 'bibleStudy'];

  // let week = this.weeks[0];
    for(let i=0; i<this.weeks.length; i++){
      let week = this.weeks[i];
      let SCHOOLS = ['primarySchool','secondarySchool'];
      if(!week.secondarySchool)
        SCHOOLS = ['primarySchool']

      let cellRef = XLSX.utils.encode_cell({r:countRow, c:0});


      draft[cellRef] = {t: 's', v:week.date.format('dddd D MMMM YYYY')};
      draft[cellRef].s = {alignment:{horizontal:'center'},font: {sz: 20, bold: true }};

      cellRef = XLSX.utils.encode_cell({r:countRow, c:7});
      draft[cellRef] = {t: 's', v:week.date.format('DD/MM/YY')};
      // draft['!ref'] = XLSX.utils.encode_range(range);

      if(week.type.meeting && !week.supervisor){

    //
             countRow++;

            draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:"Cantico",s:{font: {sz: 15, bold: true }}};
            draft[XLSX.utils.encode_cell({r:countRow, c:2})] = {v:"Presidente",s:{font: {sz: 15, bold: true }}};
            draft[XLSX.utils.encode_cell({r:countRow, c:5})] = {v:"Preghiera",s:{font: {sz: 15, bold: true }}};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
             if(draft[cellRef]) draft[cellRef] = {t: 'n', v:this.getSongNumber(week.initialSong)};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:3});
             if(draft[cellRef]) draft[cellRef].v = this.getSurnameName(week.president);
            cellRef = XLSX.utils.encode_cell({r:countRow, c:6});
            if(draft[cellRef]) draft[cellRef].v = this.getSurnameName(week.initialPrayer);
          //
            countRow++;
            draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:"Tesori della Parola di Dio",s:{alignment:{horizontal:'center'},font: {sz: 18, bold: true }}};
            countRow++;
            cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getPartTitle(week.talk.label), s:{font: {sz: 15, bold: true }}};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getSurnameName(week.talk.brother)};
          //
            countRow++;
            cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getPartTitle(week.gems.label), s:{font: {sz: 15, bold: true }}};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getSurnameName(week.gems.brother)};
          //
            countRow++;
            if(!week.presentationExercise.enabled){
              countRow++;
            }
            cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
            if (draft[cellRef]) draft[cellRef] = {t: 's', v:this.getPartSchoolTitle(week.bibleReading.label),s:{font: {sz: 15, bold: true }}};
            for(let school of SCHOOLS) {

              let column = 2;
              let columnPoint = 4;
              if (school == "secondarySchool") {
                column = 5;
                columnPoint = 7;
              }
              cellRef = XLSX.utils.encode_cell({r:countRow, c:column});
              if (draft[cellRef]) draft[cellRef].v = this.getSurnameName(week.bibleReading[school].student);
              cellRef = XLSX.utils.encode_cell({r:countRow, c:columnPoint});
              if (draft[cellRef] && week.bibleReading[school].student.student && week.bibleReading[school].student.student.bibleReadingPendingStudyNumber)
                draft[cellRef] = {t: 'n', v:week.bibleReading[school].student.student.bibleReadingPendingStudyNumber.number};
            }
          //
        draft[XLSX.utils.encode_cell({r:countRow+1, c:0})] = {v:"Efficaci nel ministero",s:{alignment:{horizontal:'center'}, font: {sz: 18, bold: true }}};

        if(week.presentationExercise.enabled){
              countRow++;
              countRow++;
              draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:"Esercitiamoci",s:{ font: {sz: 15, bold: true }}};
              cellRef = XLSX.utils.encode_cell({r:countRow, c:2});
              if(draft[cellRef]) draft[cellRef].v = this.getSurnameName(week.presentationExercise.brother);
            }else{
              for(let partType of PART_TYPE_ALL) {
                countRow++;
                countRow++;
                draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:this.getPartSchoolTitle(week[partType].label), s:{font: {sz: 15, bold: true }}};
                if(!week[partType].video){
                  for(let school of SCHOOLS) {
                    let column = 2;
                    let columnPoint = 4;
                    if(school == "secondarySchool") {column = 5; columnPoint = 7;}
                    cellRef = XLSX.utils.encode_cell({r:countRow, c:column});
                    if(draft[cellRef]) draft[cellRef].v = this.getSurnameName(week[partType][school].student);
                    cellRef = XLSX.utils.encode_cell({r:countRow, c:columnPoint});
                    if(draft[cellRef] && week[partType][school].student.student && week[partType][school].student.student.pendingStudyNumber)
                      draft[cellRef] = {t:'n', v:week[partType][school].student.student.pendingStudyNumber.number};
                    let tempRow = countRow+1;
                    cellRef = XLSX.utils.encode_cell({r:tempRow, c:column});
                    if(week[partType][school].assistant){
                      if(draft[cellRef]) draft[cellRef] = {t:'s', v:this.getSurnameName(week[partType][school].assistant)};
                    }
                    if(week[partType][school].isTalk){
                      cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
                      draft[cellRef] = {t:'s', v:this.getPartSchoolTitle(week[partType].label)};
                      draft[cellRef].s = {font: {sz: 15, bold: true }};
                    }

                  }
                }

              }
              countRow++;
              draft[XLSX.utils.encode_cell({r:countRow, c:0})].s = {font: {sz: 15, bold: true }};
            }

            countRow++;
            draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:"Vita cristiana",s:{alignment:{horizontal:'center'}, font: {sz: 18, bold: true }}};
            countRow++;
            draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:"Cantico",s:{font: {sz: 15, bold: true }}};
            //cantico intermedio
            cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
            if(draft[cellRef]) draft[cellRef] = {t: 'n', v:this.getSongNumber(week.intervalSong)};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:1});

            countRow++;
            if(week.christianLivingPart[0]){
              cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
              if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getPartTitle(week.christianLivingPart[0].label),s:{font: {sz: 15, bold: true }}} ;

              cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
              if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getSurnameName(week.christianLivingPart[0].brother)}
            }
            //
            countRow++;
            if(week.christianLivingPart[1]){
              cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
              if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getPartTitle(week.christianLivingPart[1].label),s:{font: {sz: 15, bold: true }}} ;

              cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
              if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getSurnameName(week.christianLivingPart[1].brother)}
            }else{
              cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
              if(draft[cellRef]) draft[cellRef] = {t: 's', v:""} ;

              cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
              if(draft[cellRef]) draft[cellRef] = {t: 's', v:""}
            }

            countRow++;
            draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:"Conduttore",s:{font: {sz: 15, bold: true }}};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getSurnameName(week.congregationBibleStudy.brother)} ;

            cellRef = XLSX.utils.encode_cell({r:countRow, c:5});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:"Lettore",s:{font: {sz: 15, bold: true }}};

            cellRef = XLSX.utils.encode_cell({r:countRow, c:6});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getSurnameName(week.congregationBibleStudy.reader)};

            countRow++;
            draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:"Cantico",s:{font: {sz: 15, bold: true }}};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
            if(draft[cellRef]) draft[cellRef] = {t: 'n', v:this.getSongNumber(week.finalSong)} ;

            draft[XLSX.utils.encode_cell({r:countRow, c:5})] = {v:"Preghiera",s:{font: {sz: 15, bold: true }}};
            cellRef = XLSX.utils.encode_cell({r:countRow, c:6});
            if(draft[cellRef]) draft[cellRef] = {t: 's', v:this.getSurnameName(week.finalPrayer)};

      }else{
        countRow++;

        cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
        if(!week.supervisor){
          if(draft[cellRef]) draft[cellRef] = {t: 'n', v:week.type.id};
          cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
          if(draft[cellRef]) draft[cellRef] = {t: 's', v:week.type.label};
        }else{
          if(draft[cellRef]) draft[cellRef] = {t: 'n', v:4};
          cellRef = XLSX.utils.encode_cell({r:countRow, c:1});
          if(draft[cellRef]) draft[cellRef] = {t: 's', v:"Visita del sorvegliante di circoscrizione"};
        }
        if(week.presentationExercise.enabled)
          countRow += 12;
        else
          countRow += 18;




      }
      countRow++;countRow++;
      // if(week.presentationExercise.enabled){
      //   countRow = 15;
      // }else{
      //   countRow = 15+21;
      // }
    }
    // if(this.weeks.length == 4){
      for(let i=countRow+1; i<100;i++){
        this.delete_row(draft, i)
      }
    // }
    let data = XLSX.write(this.xls, {bookType:'xlsx', bookSST:true, type: 'binary'});
    let blob = new Blob([this.s2ab(data)], { type: '' })
    let a         = document.createElement('a');
    a.href        = URL.createObjectURL(blob);
    a.target      = '_blank';
    a.download    = 'Vita-Cristiana-Ministero-Bozza-'+(this.weeks[0].date.format('MMMM-YY'))+'.xlsx';
    document.body.appendChild(a);
    a.click();

    a.href        = 'assets/xls/pgm-vcm-macro-2018.xlsm';
    a.target      = '_blank';
    a.download    = 'Vita-Cristiana-Ministero-'+(this.weeks[0].date.format('MMMM-YY'))+'.xlsm';
    document.body.appendChild(a);
    a.click();

  }

  public ec = (r, c) => {
    return XLSX.utils.encode_cell({r:r,c:c})
  }

  public getSurnameName(brother:Brother){
    return brother.surname.toUpperCase()+ ' '+brother.name.toUpperCase();
  }

  public getSongNumber(str : string){
    let songArr = str.split(">");
    let temp = songArr[1].split("<");
    // let str2 = he.decode(temp[0]);
    return temp[0].replace("&#xA0;",' ').replace("Cantico ", '');
  }

  public getPartTitle(str : string){
    var html = he.decode(str);
    html = html.split("(")[0];
    var div = document.createElement("div");
    div.innerHTML = html;
    var str = div.textContent || div.innerText || "";
    str = str.substr(0, str.length-2);
    return str.trim();
  }

  public getPartSchoolTitle(str : string){
    let html = he.decode(str);

    let div = document.createElement("div");
    div.innerHTML = html;
    str = div.textContent || div.innerText || "";
    // str = str.substr(0, str.length-2);
    let temp = str.split(":")[0];
    // temp = temp + str.split(")")[1].split(". ")[0];
    return temp.trim();
  }

  public delete_row = (ws, row_index) => {
    let range = XLSX.utils.decode_range(ws["!ref"])
    for(var R = row_index; R < range.e.r; ++R){
      for(var C = range.s.c; C <= range.e.c; ++C){
        ws[this.ec(R, C)] = ws[this.ec(R+1, C)]
      }
    }
    range.e.r--
    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
  }

  s2ab(s: any) { var buf = new ArrayBuffer(s.length); var view = new Uint8Array(buf); for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF; return buf; }

  close(){
    this.dialogRef.close();
    if(this.fromCreate){

      this.router.navigateByUrl("meeting")
    }
  }


}
