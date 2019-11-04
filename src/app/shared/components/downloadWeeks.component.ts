import { MdDialogRef } from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {WeekMeeting} from "../models/weekMeeting.model";
import * as moment from 'moment';
import {MeetingService} from "../../services/meeting.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {Brother} from "../models/brother.model";
import {CONST, CONST_LABEL} from "../../constant";

import * as jsPDF from 'jsPDF';
import * as he from 'he';

declare var XLSX:any;
@Component({
  selector: 'download-weeks',
  template: `
    <div fxLayout="column" fxLayoutAlign="center center">
      <span *ngIf="fromCreate">Programma correttamente creato</span>
      <span *ngIf="format=='XLS'">Vuoi scaricare il programma in formato Excel delle seguenti adunanze?</span>
      <span *ngIf="format=='PDF'">Vuoi scaricare il programma in formato PDF delle seguenti adunanze?</span>
      <ul>
        <li *ngFor="let week of weeks">{{week.date.format('dddd D MMMM YYYY')}}</li>
      </ul>
      <span *ngIf="fromCreate">Il programma può anche essere scaricato successivamente dalla sezione adunanze</span>
      <span *ngIf="format=='XLS'" style="text-align:center;"><strong>Cliccando su Download verranno scaricati 2 file. <br><br>
      Per ottenere il programma bisogna copiare il contenuto della prima pagina del file Vita-Cristiana-Ministero-Bozza-(mese-anno).xlsx nel primo foglio del file Vita-Cristiana-Ministero-(mese-anno).xlsm <u> avendo cura di non cambiare foglio prima di aver copiato e copiare il contenuto del primo foglio dalla prima cella in alto a destra</u><br>
      <br>
      All'apertura del file bozza vi potrà dare errori voi cliccate su "Apri e ripristina" e successivamente su "Elimina". <br></strong></span>
      <div fxLayout="row" fxLayoutAlign="center center">
        <button fxFlex md-raised-button (click)="close()">Annulla</button>
        <button *ngIf="format=='XLS'" FxFlex md-raised-button (click)="download()">Download </button>
        <button *ngIf="format=='PDF'" FxFlex md-raised-button (click)="downloadPDF()">Download</button>
      </div>
    </div>
    `,
})
export class DownloadWeeksDialog implements OnInit{

  public weeks: Array<WeekMeeting>;
  public fromCreate: Boolean;
  public format: string;
  public xls: any;

  public dateArr: Array<any> = []


  constructor(public dialogRef: MdDialogRef<DownloadWeeksDialog>, private meetingService:MeetingService, private router:Router) {
    // this.xls = XLSX.readFile('http://localhost:4200/assets/xls/pgm-vcm.xlsx')

  }

  ngOnInit(){
    if(this.format == "XLS"){
      var url = "assets/xls/pgm-draft-vcm-"+this.weeks[0].date.format('YYYY')+".xlsx";
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
  }

  getTextWidth(doc, text){
    return doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  }

  centeredText(doc, text, y) {
    var textWidth = this.getTextWidth(doc, text);
    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(textOffset, y, text);
}


  downloadPDF(){
    var doc = new jsPDF()

    let fonts = doc.getFontList();
    if(fonts.helvetica)
      doc.setFont("helvetica")
    else if(fonts.arial){
      doc.setFont("arial")
    }else if(fonts.times){
      doc.setFont("times")
    }
    this.centeredText(doc, 'Programma vita cristiana e ministero - '+this.weeks[0].date.format('MMMM YYYY'), 10);
    let PART_TYPE_ALL = ['initialCall', 'returnVisit', 'bibleStudy'];



    // doc.addPage()

    // let week = this.weeks[0];
    let row = 12;
    for(let i=0; i<this.weeks.length; i++){
      console.log(row)
      if(row>210){
        // console.log(row)
        // row = 10
        doc.addPage()
        row = 10
      }
      let week = this.weeks[i];
      doc.setFillColor(36,64,98);
      doc.rect(5, row, doc.internal.pageSize.width-10, 7, 'F')

      doc.setTextColor(255, 255, 255)
        .setFontStyle("normal")
        .setFontSize(13);
      this.centeredText(doc, week.date.format('dddd D MMMM YYYY') + " - " + week.weeklyBibleReading, row+5)
      row = row -4;
      if(week.type.meeting && !week.supervisor){
        doc.setFontSize(9)
          .setTextColor(0, 0, 0)
          .setFontStyle("normal")
          .text(5, row+15, "Cantico iniziale:");

        doc
          .setTextColor(36,64,98)
          .setFontStyle("normal")
          .text(8 + this.getTextWidth(doc, "Cantico iniziale:"), row+15, this.getSongNumber(week.initialSong));

        doc.setTextColor(0, 0, 0)
          .setFontStyle("normal")
          .text(60, row+15, "Presidente:");

        doc
          .setTextColor(36,64,98)
          .setFontStyle("normal")
          .text(63 + this.getTextWidth(doc, "Presidente:"), row+15, this.getSurnameName(week.president));

        doc.setTextColor(0, 0, 0)
          .setFontStyle("normal")
          .text(130, row+15, "Preghiera iniziale:");

        doc
          .setTextColor(36,64,98)
          .setFontStyle("normal")
          .text(133 + this.getTextWidth(doc, "Preghiera iniziale:"), row+15, this.getSurnameName(week.initialPrayer));

        doc.setFillColor(89,89,89)
          .rect(5, row+16, doc.internal.pageSize.width/2, 5, 'F')

        doc.setTextColor(255, 255, 255)
          .setFontSize(11)
          .setFontStyle("normal")
          .text(7, row+16+4, "TESORI DELLA PAROLA DI DIO")

          row = row + 20;
        doc.setTextColor(0, 0, 0)
          .setFontSize(9)
          .setFontStyle("normal")
          .text(7, row+4, this.getPartTitle(week.talk.label));
          doc.text(7, row+8, this.getPartTitle(week.gems.label));
          doc.text(7, row+16, this.getPartTitle(week.bibleReading.label));
        doc.setFontStyle("normal")
        doc.setTextColor(89, 89, 89).text(130, row+4, this.getSurnameName(week.talk.brother));
        doc.text(130, row+8, this.getSurnameName(week.gems.brother));
        doc.setFontStyle("italic").setFontSize(11).setTextColor(0, 0, 0)
        doc.text(70, row+12, "Sala principale");
        doc.text(140, row+12, "Classe supplementare 1");
        doc.setFontStyle("normal").setFontSize(9).setTextColor(89, 89, 89)
        let name = this.getSurnameName(week.bibleReading.primarySchool.student)
        doc.text(60, row+16, name);
        // if(week.bibleReading.primarySchool.student.student.bibleReadingPendingStudyNumber)
          // doc.text(62 + this.getTextWidth(doc, name), row+16, week.bibleReading.primarySchool.student.student.bibleReadingPendingStudyNumber.number+"");
        if(week.secondarySchool){
          name = this.getSurnameName(week.bibleReading.secondarySchool.student)
          doc.text(130, row+16, this.getSurnameName(week.bibleReading.secondarySchool.student));
          // if(week.bibleReading.secondarySchool.student.student.bibleReadingPendingStudyNumber)
          //   doc.text(132 + this.getTextWidth(doc, name), row+16, week.bibleReading.secondarySchool.student.student.bibleReadingPendingStudyNumber.number+"");
        }

        let rowTemp = row+17;
        doc.setFillColor(146,113,40);
        doc.rect(5, rowTemp, doc.internal.pageSize.width/2, 5, 'F')
        doc.setTextColor(255, 255, 255)
          .setFontSize(11)
          .setFontStyle("normal")
          .text(7, rowTemp+4, "EFFICACI NEL MINISTERO")

          doc.setTextColor(0, 0, 0)
          .setFontStyle("normal")
          .setFontSize(9)

        rowTemp = rowTemp +8;

        for(let part of week.ministryPart) {
          doc.setTextColor(0, 0, 0).setFontStyle("normal").setFontSize(9).text(7, rowTemp, this.getPartTitle(part.html));
          if(part.forStudent){
            name = this.getSurnameName(part.primarySchool.student);
            doc.setFontStyle("normal").setTextColor(146,113,40).text(60, rowTemp, name)

            if(part.primarySchool.assistant)
              doc.setFontSize(8).setFontStyle("italic").text(60, rowTemp+3, this.getSurnameName(part.primarySchool.assistant));
            if(week.secondarySchool){
              name = this.getSurnameName(part.secondarySchool.student);
              doc.setFontSize(9).setFontStyle("normal").text(130, rowTemp, this.getSurnameName(part.secondarySchool.student));
              if(part.secondarySchool.assistant)
                doc.setFontSize(8).setFontStyle("italic").text(130, rowTemp+3, this.getSurnameName(part.secondarySchool.assistant));
            }

          }
          rowTemp = rowTemp +8;
        }

        rowTemp = rowTemp -3;
        doc.setFillColor(153,0,0);
        doc.rect(5, rowTemp, doc.internal.pageSize.width/2, 5, 'F')
        doc.setTextColor(255, 255, 255)
        .setFontSize(11)
        .setFontStyle("normal")
        .text(7, rowTemp+4, "VITA CRISTIANA")

        doc.setFontSize(9)
        .setTextColor(0, 0, 0)
        .setFontStyle("normal")
        .text(7, rowTemp+8, "Cantico:");

      doc.setTextColor(153, 0, 0)
        .setFontStyle("normal")
        .text(10 + this.getTextWidth(doc, "Cantico:"), rowTemp+8, this.getSongNumber(week.intervalSong));

        rowTemp=rowTemp+12
      for(let part of week.christianLivingPart) {
        doc.setTextColor(0, 0, 0)
        .setFontStyle("normal")
        .text(7, rowTemp, this.getPartTitle(part.label))
        .setFontStyle("normal")
        .setTextColor(153, 0, 0)
        .text(130, rowTemp, this.getSurnameName(part.brother));

        rowTemp = rowTemp+5
      }
      if(week.christianLivingPart.length == 1){
        rowTemp = rowTemp+5
      }
      doc.setTextColor(0, 0, 0)
      .setFontStyle("normal")
      .text(7, rowTemp, "Studio biblico di congregazione")
      doc.setTextColor(0, 0, 0)
      .text(60, rowTemp, "Conduttore:");

      doc.setTextColor(153, 0, 0)
        .setFontStyle("normal")
        .text(63 + this.getTextWidth(doc, "Conduttore:"), rowTemp, this.getSurnameName(week.congregationBibleStudy.brother));

      doc.setTextColor(0, 0, 0)
        .setFontStyle("normal")
        .text(130, rowTemp, "Lettore:");

      doc.setTextColor(153, 0, 0)
        .setFontStyle("normal")
        .text(133 + this.getTextWidth(doc, "Lettore:"), rowTemp, this.getSurnameName(week.congregationBibleStudy.reader));

        rowTemp = rowTemp + 5;
      doc.setFontSize(9)
        .setTextColor(0, 0, 0)
        .setFontStyle("normal")
        .text(7, rowTemp, "Cantico finale:");

      doc.setTextColor(153, 0, 0)
        .setFontStyle("normal")
        .text(10 + this.getTextWidth(doc, "Cantico finale:"), rowTemp, this.getSongNumber(week.finalSong));

      doc.setTextColor(0, 0, 0)
        .setFontStyle("normal")
        .text(130, rowTemp, "Preghiera finale:");

      doc.setTextColor(153, 0, 0)
        .setFontStyle("normal")
        .text(133 + this.getTextWidth(doc, "Preghiera finale:"), rowTemp, this.getSurnameName(week.finalPrayer));

        row = rowTemp +2;
      }else{
        row = row+15;
        if(!week.supervisor){
          doc.setFontSize(11)
          .setTextColor(0, 0, 0)
          .setFontStyle("bold")
          this.centeredText(doc, week.type.label, row)
        }else{
          doc.setFontSize(11)
          .setTextColor(0, 0, 0)
          .setFontStyle("bold")
          this.centeredText(doc, "Visita del sorvegliante di circoscrizione", row)
        }

        row = row+2;
      }
    }


// doc.output('datauristring');
    doc.save('Vita-Cristiana-Ministero-'+ this.weeks[0].date.format('MMMM YYYY') +'.pdf')
  }

  download(){
    let sheets = this.xls.Sheets;
    let draft = sheets.Bozza;
    let countRow = 0;

  // let PART_TYPE_ALL = ['initialCall', 'returnVisit', 'bibleStudy'];

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
      // draft['!ref'] = XLSX.utils.encode_range(range);

      if(week.type.meeting && !week.supervisor){

          draft[cellRef] = {t: 's', v:week.date.format('DD/MM/YY')};

          cellRef = XLSX.utils.encode_cell({r:countRow, c:8});
          draft[cellRef] = {t: 's', v:week.weeklyBibleReading};
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
            countRow++;
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
              // if (draft[cellRef] && week.bibleReading[school].student.student && week.bibleReading[school].student.student.bibleReadingPendingStudyNumber)
              //   draft[cellRef] = {t: 'n', v:week.bibleReading[school].student.student.bibleReadingPendingStudyNumber.number};
            }
          //
        draft[XLSX.utils.encode_cell({r:countRow+1, c:0})] = {v:"Efficaci nel ministero",s:{alignment:{horizontal:'center'}, font: {sz: 18, bold: true }}};

              for(let partIndex of [0,1,2,3]) {
                countRow++;
                countRow++;
                if(week.ministryPart[partIndex]){
                  let part = week.ministryPart[partIndex];
                  draft[XLSX.utils.encode_cell({r:countRow, c:0})] = {v:this.getPartSchoolTitle(part.html), s:{font: {sz: 15, bold: true }}};
                  if(part.forStudent){
                    for(let school of SCHOOLS) {
                      let column = 2;
                      let columnPoint = 4;
                      if(school == "secondarySchool") {column = 5; columnPoint = 7;}
                      cellRef = XLSX.utils.encode_cell({r:countRow, c:column});
                      if(draft[cellRef]) draft[cellRef].v = this.getSurnameName(part[school].student);
                      cellRef = XLSX.utils.encode_cell({r:countRow, c:columnPoint});
                      // if(draft[cellRef] && week[partType][school].student.student && week[partType][school].student.student.pendingStudyNumber)
                      //   draft[cellRef] = {t:'n', v:week[partType][school].student.student.pendingStudyNumber.number};
                      let tempRow = countRow+1;
                      cellRef = XLSX.utils.encode_cell({r:tempRow, c:column});
                      if(part[school].assistant){
                        if(draft[cellRef]) draft[cellRef] = {t:'s', v:this.getSurnameName(part[school].assistant)};
                      }
                      if(part[school].isTalk){
                        cellRef = XLSX.utils.encode_cell({r:countRow, c:0});
                        draft[cellRef] = {t:'s', v:this.getPartSchoolTitle(part.html)};
                        draft[cellRef].s = {font: {sz: 15, bold: true }};
                      }

                    }
                  }
                }

              }
              countRow++;
              draft[XLSX.utils.encode_cell({r:countRow, c:0})].s = {font: {sz: 15, bold: true }};

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
        draft[cellRef] = {t: 's', v:week.date.format('DD/MM/YY')};
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
        countRow += 20;




      }
      countRow++;countRow++;
      // if(week.presentationExercise.enabled){
      //   countRow = 15;
      // }else{
      //   countRow = 15+21;
      // }
    }

    let draftAssegnation = sheets.BozzaAssegnazioni;
    let countRowAssegnation = 0;
    let countColumnAssegnation = 0;
    for(let i=0; i<this.weeks.length; i++){
      let week = this.weeks[i];
      if(week.type.meeting && !week.supervisor){
        let SCHOOLS = ['primarySchool','secondarySchool'];
        if(!week.secondarySchool)
          SCHOOLS = ['primarySchool']
        let cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
        for(let school of SCHOOLS) {
          cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
          draftAssegnation[cellRef] = {t: 's', v:week.date.format('D MMMM YYYY').toUpperCase()};
          countColumnAssegnation++;
          cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
          draftAssegnation[cellRef] = {t: 's', v:this.getSurnameName(week.bibleReading[school].student)} ;
          countColumnAssegnation++;countColumnAssegnation++;
          cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
          draftAssegnation[cellRef] = {t: 's', v:this.getPartSchoolLesson(week.bibleReading.label)} ;
          countColumnAssegnation++;
          cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
          draftAssegnation[cellRef] = {t: 's', v:this.getPartSchoolTitle(week.bibleReading.label)} ;
          countColumnAssegnation++;
          cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
          if(school == "primarySchool")
            draftAssegnation[cellRef] = {t: 'n', v:1} ;
          else if(school == "secondarySchool")
            draftAssegnation[cellRef] = {t: 'n', v:2} ;

            countRowAssegnation++;
          countColumnAssegnation = 0;
        }
        for(let part of week.ministryPart){
          if(part.forStudent){
            for(let school of SCHOOLS) {
              cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
              draftAssegnation[cellRef] = {t: 's', v:week.date.format('D MMMM YYYY').toUpperCase()};
              countColumnAssegnation++;
              cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
              draftAssegnation[cellRef] = {t: 's', v:this.getSurnameName(part[school].student)} ;
              countColumnAssegnation++;
              if(part[school].assistant){
                cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
                draftAssegnation[cellRef] = {t: 's', v:this.getSurnameName(part[school].assistant)} ;
                countColumnAssegnation++;
              }else{
                countColumnAssegnation++;
              }

              cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
              draftAssegnation[cellRef] = {t: 's', v:this.getPartSchoolLesson(part.html)} ;
              countColumnAssegnation++;
              cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
              draftAssegnation[cellRef] = {t: 's', v:this.getPartSchoolTitle(part.html)} ;
              countColumnAssegnation++;
              cellRef = XLSX.utils.encode_cell({r:countRowAssegnation, c:countColumnAssegnation});
              if(school == "primarySchool")
                draftAssegnation[cellRef] = {t: 'n', v:1} ;
              else if(school == "secondarySchool")
                draftAssegnation[cellRef] = {t: 'n', v:2} ;

                countRowAssegnation++;
              countColumnAssegnation = 0;
            }
          }else{

          }
        }
      }


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

    a.href        = 'assets/xls/pgm-vcm-macro-'+this.weeks[0].date.format('YYYY')+'.xlsm';
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

  public getPartTitle(str : String){
    var html = he.decode(str);
    html = html.split("(")[0];
    var div = document.createElement("div");
    div.innerHTML = html;
    var newstr = div.textContent || div.innerText || "";
    newstr = newstr.substr(0, newstr.length-1);
    return newstr.trim();
  }

  public getPartSchoolTitle(str : String){
    let html = he.decode(str);

    let div = document.createElement("div");
    div.innerHTML = html;
    str = div.textContent || div.innerText || "";
    // str = str.substr(0, str.length-2);
    let temp = str.split("(")[0];
    // temp = temp + str.split(")")[1].split(". ")[0];
    return temp.trim();
  }

  public getPartSchoolLesson(str : String){
    let html = he.decode(str);

    let div = document.createElement("div");
    div.innerHTML = html;
    str = div.textContent || div.innerText || "";
    return str.split("(th")[1].split(")")[0].trim().toUpperCase();;
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
