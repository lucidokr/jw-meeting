import {
  Component, OnInit, Input, Inject, ElementRef, ViewChild, AfterContentChecked,
  EventEmitter, HostListener, AfterViewInit
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';
import {EmitterService} from "../../services/emitter.service";
import {AmChartsService} from "@amcharts/amcharts3-angular";
import {HistoryService} from "../../services/history.service";
import {History} from "../../shared/models/history.model";
import {Brother} from "../../shared/models/brother.model";
import {BrotherService} from "../../services/brother.service";

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit{
  public chartPart : any;
  public chartByYear : any;
  public chartByMonth : any;
  public chartByBrother : any;

  public years = [];
  public months = [];
  public selectedYear = 0;
  public selectedMonth = 0;

  public histories:Array<History>;

  public colorMade = "#22aa24"
  public colorNotMade = "#c00000"
  public colorMadeWithoutPoint = "#cdcd00"


  constructor(private emitterService: EmitterService, private AmCharts: AmChartsService,private historyService:HistoryService,private brotherService:BrotherService) {
    this.emitterService.get("change_header_subtitle")
      .emit('Statistiche');

    this.selectedYear = moment().year();
    this.selectedMonth = moment().month();
    this.months = moment.months();
    this.years.push(moment().year());
    this.years.push(moment().add(-1,'y').year());
    this.years.push(moment().add(-2,'y').year());

  }

  ngOnInit(){

    this.historyService.getHistory().subscribe((histories:Array<History>) => {
      this.histories = histories;
      this.buildChartPart();
      this.buildChartByYear();
      this.buildChartByMonth();
      this.brotherService.get().subscribe((brothers:Array<Brother>) => {
        this.buildChartByBrother(histories, brothers);
      });
    });
  }

  buildChartPart(){
      let histories = this.histories;
      let countMade = 0;
      let countMadeWithoutPoint = 0;
      let countNotMade = 0;
      for(let history of histories){
        if(history.made && history.pointCompleted){
          countMade++
        }else if(history.made && !history.pointCompleted){
          countMadeWithoutPoint++;
        }else if(!history.made){
          countNotMade++;
        }
      }

      this.chartPart = this.AmCharts.makeChart( "chart", {
        "titles": [ {
          "text": "Percentuale Andamento parti - Totale: "+histories.length,
          "size": 16
        } ],
        "type": "pie",
        "theme": "light",
        "dataProvider": [ {
          "title": "Svolti (Qualità oratoria superata)",
          "value": countMade,
          "color": this.colorMade
        }, {
          "title": "Svolti (Qualità oratoria non superata)",
          "value": countMadeWithoutPoint,
          "color": this.colorMadeWithoutPoint
        }, {
          "title": "Non svolti",
          "value": countNotMade,
          "color": this.colorNotMade
        }],
        "valueField": "value",
        "titleField": "title",
        "outlineAlpha": 0.4,
        "depth3D": 15,
        "colorField": "color",
        "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        "angle": 30,
        "export": {
          "enabled": true
        }
      } );
  }

  buildChartByYear(){
    let histories = this.histories;
    let currentDate = moment().year(this.selectedYear).month(12);
    let allMonths = moment.months();

    let model = [];
    // let date = moment(currentDate.add(-1, 'M'));
    // arrMonths.push({date: date, month: allMonths[date.month()], year: date.year()});
    for(let i = 11; i>= 0; i--){
      if(!model[i])
        model[i] ={month:'', made:0, madeWithoutPoint:0, notMade:0}
      let date = moment(currentDate.add(-1, 'M'));
      model[i].month = date.month()+1 + "/"+date.year();
      for(let history of histories){
        let historyDate = moment(history.date).add(-2, 'd');
        if(historyDate.month() == date.month() && historyDate.year() == date.year()){
          if(history.made && history.pointCompleted){
            model[i].made++
          }else if(history.made && !history.pointCompleted){
            model[i].madeWithoutPoint++;
          }else if(!history.made){
            model[i].notMade++;
          }
        }
      }
    }


    this.chartByYear = this.AmCharts.makeChart("chartByYear", {
      "theme": "light",
      "type": "serial",
      "dataProvider": model,
      "valueAxes": [{
        "stackType": "3d",
        "position": "left",
        "title": "Andamento parti durante l'anno "+ this.selectedYear,
      }],
      "startDuration": 1,
      "graphs": [{
        "balloonText": "Non svolti <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "Svolti",
        "type": "column",
        "valueField": "notMade",
        "columnWidth":.6,
        "fillColors":this.colorNotMade
      },{
        "balloonText": "Svolti (qualità oratoria non superata) <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "Svolti",
        "type": "column",
        "valueField": "madeWithoutPoint",
        "columnWidth":.6,
        "fillColors":this.colorMadeWithoutPoint
      },{
        "balloonText": "Svolti (qualità oratoria superata) <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "Svolti",
        "type": "column",
        "valueField": "made",
        "columnWidth":.6,
        "fillColors":this.colorMade
      }],
      "plotAreaFillAlphas": 0.1,
      "depth3D": 60,
      "angle": 30,
      "categoryField": "month",
      "categoryAxis": {
        "gridPosition": "start"
      },
      "export": {
        "enabled": true
      }
    });
  }

  buildChartByMonth(){
    let histories = this.histories;
    let dateArr = [];
    let currentDate = moment().year(this.selectedYear).month(this.selectedMonth).day(1);

    currentDate.startOf('week').isoWeekday(1);
    var monday = currentDate
      .startOf('month')
      .day(1)
    if (monday.date() > 7) monday.add(7,'d');
    var month = monday.month();
    while(month === monday.month()){
      dateArr.push(moment(monday).add(2, 'd'));
      monday.add(7,'d');
    }

    let allMonths = moment.months();

    let model = [];
    // let date = moment(currentDate.add(-1, 'M'));
    // arrMonths.push({date: date, month: allMonths[date.month()], year: date.year()});
    // for(let i = 0; i < 5; i--){
    //   if(!model[i])
    //     model[i] ={month:'', made:0, madeWithoutPoint:0, notMade:0}
    //   let date = moment(currentDate.add(-1, 'M'));
    for(let i in dateArr){
      if(!model[i]){
        let tempDate = moment(dateArr[i]).add(-2, 'd');
        model[i] ={week: "Settimana del "+tempDate.date()+"/"+(tempDate.month()+1)+"/"+tempDate.year(), made:0, madeWithoutPoint:0, notMade:0};
      }
      for(let history of histories){
        if(history.date.month() == dateArr[i].month() && history.date.year() == dateArr[i].year() && history.date.date() == dateArr[i].date()){
          if(history.made && history.pointCompleted){
            model[i].made++
          }else if(history.made && !history.pointCompleted){
            model[i].madeWithoutPoint++;
          }else if(!history.made){
            model[i].notMade++;
          }
        }
        // }
      }
    }



    this.chartByMonth = this.AmCharts.makeChart("chartByMonth", {
      "theme": "light",
      "type": "serial",
      "dataProvider": model,
      "valueAxes": [{
        "stackType": "3d",
        "position": "left",
        "title": "Andamento parti durante il mese "+ this.selectedMonth+"/"+this.selectedYear,
      }],
      "startDuration": 1,
      "graphs": [{
        "balloonText": "Non svolti <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "Svolti",
        "type": "column",
        "valueField": "notMade",
        "columnWidth":.3,
        "fillColors":this.colorNotMade
      },{
        "balloonText": "Svolti (qualità oratoria non superata) <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "Svolti",
        "type": "column",
        "valueField": "madeWithoutPoint",
        "columnWidth":.3,
        "fillColors":this.colorMadeWithoutPoint
      },{
        "balloonText": "Svolti (qualità oratoria superata) <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "Svolti",
        "type": "column",
        "valueField": "made",
        "columnWidth":.3,
        "fillColors":this.colorMade
      }],
      "plotAreaFillAlphas": 0.1,
      "depth3D": 60,
      "angle": 30,
      "categoryField": "week",
      "categoryAxis": {
        "gridPosition": "start"
      },
      "export": {
        "enabled": true
      }
    });
  }

  buildChartByBrother(histories, brothers){
    let brothersChart = [];
    for(let brother of brothers){
      let obj = {...brother};
      obj.made = 0;
      obj.madeWithoutPoint = 0;
      obj.notMade = 0;
      obj.total = 0;
      brothersChart[brother._id] = obj;
    }

    for(let history of histories){
      brothersChart[history.student._id].total++;
      if(history.made && history.pointCompleted){
        brothersChart[history.student._id].made++;
      }else if(history.made && !history.pointCompleted){
        brothersChart[history.student._id].madeWithoutPoint++;
      }else if(!history.made){
        brothersChart[history.student._id].notMade++;
      }
    }

    this.chartByBrother = brothersChart

  }

  ngAfterViewInit(){

  }

  ngOnDestroy() {
    this.AmCharts.destroyChart(this.chartPart);
  }


}
