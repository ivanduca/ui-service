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

  protected filterFormSearch: FormGroup;

  protected optionsWorkflow: Array<SelectControlOption> = [];
  protected optionsRule: Array<SelectControlOption> = [];


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

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.ruleService.getRules().subscribe((rule) => {
        let rules: SelectRule[] = rule.getKeys(undefined, Rule.AMMINISTRAZIONE_TRASPARENTE, [], -1);
        Object.keys(rules).forEach((index) => {
          this.optionsRule.push({
            value: rules[index].key,
            text: rules[index].text,
            selected: rules[index].key === queryParams.ruleName
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
          workflowId: new FormControl(queryParams.workflowId || lastWorkflowId),
          ruleName: new FormControl(queryParams.ruleName || Rule.AMMINISTRAZIONE_TRASPARENTE),
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
    this.resultService.getWorkflowMap(this.filterFormSearch.value.ruleName, [this.filterFormSearch.value.workflowId]).subscribe((result: any) => {
      if (!result[this.filterFormSearch.value.workflowId]) {
        this.router.navigate(['error/not-found']);
      }
      this.isPieLoaded = true;
      this.loadChart(result[this.filterFormSearch.value.workflowId]);
    });; 
  }

  loadChart(result: any) {
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
    }
  }
}
