import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ConductorService } from '../conductor/conductor.service';
import { Workflow } from '../conductor/workflow.model';
import { ResultService } from '../result/result.service';
import { Rule } from '../rule/rule.model';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DurationFormatPipe } from '../../shared/pipes/durationFormat.pipe';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';

import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, DurationFormatPipe],
  styles : `
  .home-main {
    background: #d1e7ff left center no-repeat;
  }
  .callout-inner {
    padding: 1rem!important;
    margin-bottom: 0px!important;
  }
  .callout-title {
    top: -2rem!important;
  }
  .legend {
    margin: -24px;
  }
  `
})
export class HomeComponent implements OnInit {
  workflows: Workflow[];
  currentWorkflow: Workflow;

  single = undefined;

  // options
  isWorkflowLoaded: boolean = false;

  series: any;
  chartDivStyle: string = 'height:75vh !important';

  public filterFormSearch: FormGroup;

  @ViewChild('chartdiv', {static: true}) chartdiv: ElementRef;
  @ViewChild('columnchartdiv', {static: true}) columnchartdiv: ElementRef;

  constructor(
    protected httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private conductorService: ConductorService,
    private translateService: TranslateService,
    private responsive: BreakpointObserver,
    private resultService: ResultService) {
  }

  @HostListener("window:resize", []) 
  pieChartLabels() {
    this.responsive.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result?.matches) {
        this.series?.labels?.template?.set("forceHidden", true);
        this.series?.ticks?.template?.set("visible", false);
        this.chartDivStyle = 'height:30vh !important';
      }
    });
  }

  ngOnInit(): void {
    this.filterFormSearch = this.formBuilder.group({
      workflowId: new FormControl(''),
    });
    this.filterFormSearch.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      let workflowId = this.filterFormSearch.value['workflowId'];
      let wokflow = this.workflows.filter((workflow: Workflow) => {
        return workflow.workflowId === workflowId
      })[0];
      this.loadChart(wokflow.resultCount, workflowId);
    });
    this.conductorService.getAll({
      includeClosed: true,
      includeTasks: false
    }).subscribe((workflows: Workflow[]) => {
      this.resultService.getWorkflowMap(Rule.AMMINISTRAZIONE_TRASPARENTE, workflows.map(a => a.workflowId)).subscribe((result: any) => {
        this.workflows = workflows;
        workflows.forEach((workflow, i) => {
          if (workflow.status === 'COMPLETED') {
            if (!this.currentWorkflow) {
              this.currentWorkflow = workflow;
            }
          }
          workflow.resultCount = result[workflow.workflowId];
          if (this.currentWorkflow && !this.series){
            this.loadChart(workflow.resultCount, workflow.workflowId);
          }
        });
        this.isWorkflowLoaded = true;
      });
    });
  }

  loadChart(result: any, workflowId: string) {
    if (this.chartdiv) {
      let chartDiv: HTMLElement = this.chartdiv.nativeElement;
      let root = am5.Root.new(chartDiv);
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          endAngle: 180        
        })
      );
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "name",
        })
      );
      series.states.create("hidden", {
        endAngle: -90
      });
      series.get("colors").set("colors", [
        am5.color('#008055'),
        am5.color('#995c00'),
        am5.color('#cc334d'),
        am5.color('#f73e5a'),
        am5.color('#330d12'),
      ]);
      root.numberFormatter.setAll({
        numberFormat: "#,###.00",
        numericFields: ["value"]
      });       
      series.labels.template.setAll({
        fontSize: 28,
        fontWeight: 'bold',
        text: "{valuePercentTotal}%",
      });      
      series.ticks.template.setAll({
        strokeWidth: 2,
        fill: am5.color('#000000'),
        strokeOpacity: 1
      })
    
      this.single = [];
      Object.keys(result).forEach((key) => {
        this.single.push({
          name: this.translateService.instant(`it.rule.status.${key}.title`),
          value: result[key],
          extra: {
            key: key,
            workflowId: workflowId  
          }
        });
      });
      series.data.setAll(this.single);

      this.series = series;
      this.pieChartLabels();      
    }
  }
}
