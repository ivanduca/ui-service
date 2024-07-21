import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ConductorService } from '../conductor/conductor.service';
import { Workflow } from '../conductor/workflow.model';
import { ResultService } from './result.service';
import { Rule, SelectRule } from '../rule/rule.model';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable } from 'rxjs';
import { DurationFormatPipe } from '../../shared/pipes/durationFormat.pipe';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectControlOption } from 'design-angular-kit';
import { RuleService } from '../rule/rule.service';
import { StatusColor } from '../../common/model/status-color.enum';

import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";
import am5locales_it_IT from "@amcharts/amcharts5/locales/it_IT";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-result-pie',
  templateUrl: './result-pie.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, DurationFormatPipe],
  styles : `
  `
})
export class ResultPieComponent implements OnInit {

  single = undefined;

  // options
  isWorkflowLoaded: boolean = false;

  series: any;
  root;
  chartDivStyle: string = 'height:75vh !important';
  protected isPieLoaded = false;
  protected total: number;
  protected ruleName: string;

  protected filterFormSearch: FormGroup;

  protected optionsWorkflow: Array<SelectControlOption> = [];
  protected optionsRule: Array<any>;
  protected rules: SelectRule[];

  @ViewChild('chartdiv', {static: true}) chartdiv: ElementRef;
  @ViewChild('columnchartdiv', {static: true}) columnchartdiv: ElementRef;

  constructor(
    protected httpClient: HttpClient,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ruleService: RuleService,
    private conductorService: ConductorService,
    private translateService: TranslateService,
    private responsive: BreakpointObserver,
    private router: Router,
    private datepipe: DatePipe,
    private durationFormatPipe: DurationFormatPipe,
    private resultService: ResultService) {
  }


  @HostListener("window:resize", []) 
  pieChartLabels() {
    this.responsive.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {      
      this.series?.labels.template.setAll({
        fontSize: result?.matches ? 12 : 28,
        fontWeight: result?.matches ? 'normal': 'bold',
        text: "{valuePercentTotal.formatNumber('0.00')}%",
      });      
      this.chartDivStyle = `height:${result?.matches ? '30' : '75'}vh !important`;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.ruleName = queryParams.ruleName || Rule.AMMINISTRAZIONE_TRASPARENTE;
      this.ruleService.getRules().subscribe((rule) => {
        this.optionsRule = [];
        this.rules = rule.getKeys(undefined, undefined, Rule.AMMINISTRAZIONE_TRASPARENTE, [], -1);
        Object.keys(this.rules).forEach((index) => {
          this.optionsRule.push({
            value: this.rules[index].key,
            text: this.rules[index].text,
            level: this.rules[index].level,
            class: `ps-${this.rules[index].level} fs-${this.rules[index].level + 3}`
          });
        });
      });
      this.conductorService.getAll({
        includeClosed: true,
        includeTasks: false
      }).subscribe((workflows: Workflow[]) => {        
        this.isWorkflowLoaded = true;
        let lastWorkflowId;
        workflows.forEach((workflow: Workflow) => {
          if (workflow.status === 'COMPLETED') {
            if (!lastWorkflowId) {
              lastWorkflowId = workflow.workflowId;
            }
            this.optionsWorkflow.push({
              value: workflow.workflowId,
              text: this.translateService.instant('it.workflow.textfull', {
                startTime: this.datepipe.transform(workflow.startTime, 'dd/MM/yyyy'),
                duration: this.durationFormatPipe.transform(workflow.executionTime)
              })
            });
          }
        });
        this.filterFormSearch = this.formBuilder.group({
          workflowId: new FormControl(queryParams.workflowId || lastWorkflowId)
        });
        this.filterFormSearch.valueChanges.pipe(
          debounceTime(500)
        ).subscribe(() => {
          this.loadResult();
        });
        this.root = am5.Root.new(this.chartdiv.nativeElement);
        this.root.locale = am5locales_it_IT;
        this.loadResult();
      });
    });
  }

  loadResult() : void {
    this.isPieLoaded = false;
    let wokflowId = this.filterFormSearch.value.workflowId;
    let parentKey = this.rules.filter((rule: SelectRule) => {
      return rule.key === this.filterFormSearch.value.ruleName
    })[0].parentKey;
    this.resultService.getWorkflowMap(this.filterFormSearch.value.ruleName, [wokflowId]).subscribe((result: any) => {
      if (!result[wokflowId]) {
        this.router.navigate(['error/not-found']);
      }
      let chart = result[wokflowId];
      if (parentKey) {
        this.resultService.getWorkflowMap(parentKey, [wokflowId]).subscribe((result: any) => {
          let total = Number(result[wokflowId][200]||0) + Number(result[wokflowId][202]||0); 
          chart[500] = total - Number(Object.values(chart).reduce((a: number, b: number) => a + b, 0)); 
          this.loadChart(chart);
        });
      } else {
        this.loadChart(chart);
      }
    });; 
  }

  loadChart(result: any) {
    this.isPieLoaded = true;
    this.total = Number(Object.values(result).reduce((a: number, b: number) => a + b, 0)); 
    if (this.chartdiv) {
      this.root.setThemes([
        am5themes_Animated.new(this.root)
      ]);
      this.root.container.children.clear();
      let chart = this.root.container.children.push(
        am5percent.PieChart.new(this.root, {
          endAngle: 180        
        })
      );
      let series = chart.series.push(
        am5percent.PieSeries.new(this.root, {
          valueField: "value",
          categoryField: "name"
        })
      );
      
      series.states.create("hidden", {
        endAngle: -90
      });

      series.labels.template.setAll({
        fontSize: 28,
        fontWeight: 'bold',
        text: "{valuePercentTotal.formatNumber('0.00')}%",
      });
      series.ticks.template.setAll({
        strokeWidth: 2,
        fill: am5.color('#000000'),
        strokeOpacity: 1
      })

      series.slices.template.setAll({
        templateField: "sliceSettings"
      });

      series.slices.template.setAll({
        strokeWidth: 2,
        tooltipText:
          "{category}: {value.formatNumber(',000')}"
      });

      series.slices.template.events.on("click", function(ev) {
        var status = ev.target.dataItem.dataContext.extra.key;
        if (status != 500) {
          this.router.navigate(['/search'],  { queryParams: {
            workflowId: this.filterFormSearch.value.workflowId,
            ruleName: this.filterFormSearch.value.ruleName,
            status: status 
          }});  
        }
      }, this);

      this.single = [];
      Object.keys(result).forEach((key) => {
        this.single.push({
          name: this.translateService.instant(`it.rule.status.${key}.ruletitle`),
          value: result[key],
          sliceSettings: {
            fill: am5.color(StatusColor[`STATUS_${key}`]),
            stroke: am5.color(StatusColor[`STATUS_${key}`])
          },
          extra: {
            key: key  
          }
        });
      });
      series.data.setAll(this.single);
      series.appear(1000, 100);      
      this.series = series;
      this.pieChartLabels();
    }
  }
}
