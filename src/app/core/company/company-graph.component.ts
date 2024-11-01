import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, OnChanges, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OrgChart } from "d3-org-chart";
import { RuleService } from '../rule/rule.service';
import { Rule, RuleChart } from '../rule/rule.model';
import { Helpers } from '../../common/helpers/helpers';
import { jsPDF } from "jspdf";
import { ConductorService } from '../conductor/conductor.service';
import { Workflow } from '../conductor/workflow.model';
import { ResultService } from '../result/result.service';
import { Result } from '../result/result.model';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { ItTabContainerComponent, ItTabItemComponent, NotificationPosition, SelectControlOption } from 'design-angular-kit';
import { ApiMessageService, MessageType } from '../api-message.service';
import { of as observableOf, Observable, map } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'company-graph',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './company-graph.component.html',
  providers: [DatePipe],
  styles: `
    #chartContainer {
      min-height: 40vh;
      height: 100%;
    }  

    @media screen and (min-width: 992px) {
      #chartContainer {
        min-height: 60vh;
      }  
    }
    .select-wrapper {
      margin-bottom: 1rem !important;
    }  
  `
})
export class CompanyGraphComponent implements OnInit, OnDestroy, OnChanges{
  
  index: number = 3;
  compact: number = 0;
  rating: number;
  data: any[];
  rulesOK: number;
  currentNode: any;
  @ViewChild("chartContainer") chartContainer: ElementRef;
  chart;

  protected codiceIpa: string;
  protected company: Company;
  protected fromMap: boolean;

  tabPAActive: boolean;
  tabRuleActive: boolean;
  protected ruleStatus = {};
  @ViewChild("tab") tab: ItTabContainerComponent;
  @ViewChild("tabPA") tabPA: ItTabItemComponent;
  @ViewChild("tabRule") tabRule: ItTabItemComponent;
  protected filterFormSearch: FormGroup;
  optionsWorkflow: Array<SelectControlOption>;

  chartDivStyle: string = 'height:30vh !important';
  @ViewChild('chartdiv', {static: true}) chartdiv: ElementRef;
  root;
  chartGauge;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              protected apiMessageService: ApiMessageService,
              private ruleService: RuleService,
              private resultService: ResultService,
              private conductorService: ConductorService,
              private companyService: CompanyService,
              private translateService: TranslateService,
              private datepipe: DatePipe,
              protected router: Router) {}

  ngOnInit(): void {
    this.translateService.get(`it.rule.status`).subscribe((status) => {
      this.ruleStatus = status;
    });
    this.filterFormSearch = this.formBuilder.group({
      workflowId: new FormControl()
    });
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.codiceIpa = queryParams.codiceIpa;
      this.fromMap = queryParams.fromMap;
      if (this.codiceIpa) {
        this.companyService.getAll({
          codiceIpa: this.codiceIpa,
          size: 1
        }).subscribe((company: Company[]) => {
          this.company = company[0];
          this.tabRuleActive = true;
          this.tabPAActive = false;
          if (!this.company) {
            this.apiMessageService.sendMessage(MessageType.ERROR,  `PA non presente!`);
          }
        });
        this.getWorkflow(queryParams).subscribe((workflowId: string) => {
          this.filterFormSearch.controls['workflowId'].patchValue(workflowId);
          this.filterFormSearch.valueChanges.subscribe((value: any) => {
            this.manageChart(value.workflowId);
          });  
          this.conductorService.getAll({
            includeClosed: true,
            includeTasks: false
          }).subscribe((workflows: Workflow[]) => {
            this.optionsWorkflow = [];
            this.conductorService.getAll({
              includeClosed: true,
              includeTasks: false
            },`/${ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW}/correlated/${this.codiceIpa}`).subscribe((ipaWorkflows: Workflow[]) => {
              ipaWorkflows.concat(workflows).sort((a,b) => (a.startTime < b.startTime)? 1 : -1).forEach((workflow: Workflow) => {
                this.optionsWorkflow.push({
                  value: workflow.workflowId,
                  text: this.translateService.instant('it.workflow.text', {
                    startTime: this.datepipe.transform(workflow.startTime, 'dd/MM/yyyy HH:mm:ss'),
                    status: this.translateService.instant(`it.workflow.status.${workflow.status}`)
                  }),
                  selected: workflow.workflowId === queryParams['workflowId']
                });
              });  
            });      
          });
          this.manageChart(workflowId);
        });
      } else {
        this.chartDivStyle = 'height:0px !important';
        this.ruleService.getRules().subscribe((rule: Rule) => {
          this.data = rule.getCharts(undefined, Rule.AMMINISTRAZIONE_TRASPARENTE, []);
          this.data.forEach((ruleChart: RuleChart) => {
            if (ruleChart.nodeId === Rule.AMMINISTRAZIONE_TRASPARENTE) {
              this.currentNode = {
                data: ruleChart
              };
              this.tabRuleActive = true;
            }
          });
          this.updateChart();
        });  
      }
    });
  }

  manageChart(workflowId: string) {
    this.resultService.getAll({
      workflowId: workflowId,
      codiceIpa: this.codiceIpa,
      size: 500,
      noCache: true
    }).subscribe((results: Result[]) => {
      if (results.length === 0) {
        this.apiMessageService.sendMessage(MessageType.WARNING, `Risultati non presenti per la PA: ${this.company.denominazioneEnte}!`);
      }
      this.rulesOK = results.filter(result => result.status == 200 || result.status == 202).length;
      this.ruleService.getRules().subscribe((rule: Rule) => {
        this.data = rule.getCharts(undefined, Rule.AMMINISTRAZIONE_TRASPARENTE, []);
        this.rating = Math.trunc((this.rulesOK * 100 / this.data.length) / 20);
        this.loadChart();
        this.data.forEach((ruleChart: RuleChart) => {
          let childStatus : Number[] = [];
          this.data.filter(result => result.parentNodeId == ruleChart.nodeId).forEach((childRule: RuleChart) => {
            let child = results.filter(result => result.ruleName == childRule.nodeId);
            if (child && child.length == 1) {
              childStatus.push(child[0].status);
            }
          });
          let result = results.filter(result => result.ruleName == ruleChart.nodeId)[0];
          if (ruleChart.nodeId === Rule.AMMINISTRAZIONE_TRASPARENTE) {
            this.currentNode = {
              data: ruleChart
            };
          }
          ruleChart.ruleStatus = this.ruleStatus;
          if (result) {
            ruleChart.status = result.status;
            ruleChart.destinationUrl = result.destinationUrl;
            ruleChart.color = result.color;
            ruleChart.childStatus = childStatus;
            ruleChart.updatedAt = result.updatedAt; 
            ruleChart.storageData = result.storageData;
            ruleChart.workflowChildId = result.workflowChildId;
            ruleChart.content = result.content;
            ruleChart.buttonColor = 'danger';  
            if (childStatus && childStatus.length > 0) {
              let successCount = childStatus.filter(result => result == 200 || result == 202).length;
              console.log(`${result.ruleName} width total:${childStatus.length} and succes: ${successCount}`);
              if (successCount == 0) {
                ruleChart.buttonColor = 'danger';  
              } else if (successCount < childStatus.length) {
                ruleChart.buttonColor = 'warning';  
              } else {
                ruleChart.buttonColor = 'success';  
              }
            }
          } else {
            ruleChart.status = 404;
            ruleChart.color = 'danger';
            ruleChart.buttonColor = 'danger';
          }
        });
        this.updateChart();
      });  
    });
  }

  loadChart() {
    if(this.chartdiv?.nativeElement && !this.root) {
      this.root = am5.Root.new(this.chartdiv?.nativeElement);
    }
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);
    this.root.container.children.clear();
    this.root.container.set("layout", this.root.verticalLayout);
    
    this.chartGauge = this.root.container.children.push(am5radar.RadarChart.new(this.root, {
      startAngle: 160,
      endAngle: 380
    }));
    let axisRenderer = am5radar.AxisRendererCircular.new(this.root, {
      innerRadius: -40,
      minGridDistance: 50
    });    
    axisRenderer.grid.template.setAll({
      stroke: this.root.interfaceColors.get("background"),
      visible: true,
      strokeOpacity: 0.8
    });
    axisRenderer.ticks.template.setAll({
      visible: true,
      strokeOpacity: 1,
    });

    axisRenderer.labels.template.setAll({
      fontSize: 15,
      visible: true
    });

    let xAxis = this.chartGauge.xAxes.push(am5xy.ValueAxis.new(this.root, {
      maxDeviation: 0,
      min: 0,
      max: this.data?.length,
      strictMinMax: true,
      renderer: axisRenderer
    }));    
    // Add clock hand
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
    let axisDataItem = xAxis.makeDataItem({});

    let clockHand = am5radar.ClockHand.new(this.root, {
      pinRadius: am5.percent(20),
      radius: am5.percent(100),
      bottomWidth: 40
    })

    let bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(this.root, {
      sprite: clockHand
    }));

    xAxis.createAxisRange(axisDataItem);

    let label = this.chartGauge.radarContainer.children.push(am5.Label.new(this.root, {
      fill: am5.color(0xffffff),
      centerX: am5.percent(50),
      textAlign: "center",
      centerY: am5.percent(50),
      fontSize: "1.5em"
    }));
    
    axisDataItem.set("value", this.rulesOK);
    bullet.get("sprite").on("rotation", function () {
      let value = axisDataItem.get("value");
      let text = Math.round(axisDataItem.get("value")).toString();
      let fill = am5.color(0x000000);
      xAxis.axisRanges.each(function (axisRange) {
        if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
          fill = axisRange.get("axisFill").get("fill");
        }
      })

      label.set("text", Math.round(value).toString());

      clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
      clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
    });
    this.chartGauge.bulletsContainer.set("mask", undefined);
    // Create axis ranges bands
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
    let bandsData = [{
      color: "#ee1f25",
      lowScore: 0,
      highScore: 20
    }, {
      color: "#f04922",
      lowScore: 20,
      highScore: 40
    }, {
      color: "#fdae19",
      lowScore: 40,
      highScore: 60
    }, {
      color: "#b0d136",
      lowScore: 60,
      highScore: 80
    }, {
      color: "#54b947",
      lowScore: 80,
      highScore: 100
    }, {
      color: "#0f9747",
      lowScore: 100,
      highScore: this.data?.length
    }];

    am5.array.each(bandsData, function (data) {
      let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

      axisRange.setAll({
        value: data.lowScore,
        endValue: data.highScore
      });

      axisRange.get("axisFill").setAll({
        visible: true,
        fill: am5.color(data.color),
        fillOpacity: 0.8
      });

    });


    // Make stuff animate on load
    this.chartGauge.appear(1000, 100);
    
  }

  getWorkflow(queryParams: Params): Observable<string> {
    if (queryParams.workflowId) {
      return observableOf(queryParams.workflowId);
    }
    return this.conductorService.lastWorflow().pipe(map((workflow: Workflow) => {
      return workflow.workflowId;
    }));
  }

  tabSelected(tab: ItTabItemComponent) {
    setTimeout(() => {
      this.chart?.svgHeight(this.chartContainer.nativeElement.offsetHeight).render();
    }, 1000);
    if (tab.id === this.tabPA.id) {
      this.tabRuleActive = false;
      this.tabPAActive = true;
    }
  }

  ngAfterViewInit() {
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.updateChart();
    setTimeout(() => {
      this.chart?.svgHeight(this.chartContainer.nativeElement.offsetHeight).render();
    }, 1000);
  }

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    if (!this.data) {
      return; 
    }
    if (!this.chart) {
      return; 
    }
    if (!this.chartContainer) {
      return;
    }
    this.chart
      .container(this.chartContainer.nativeElement)
      .imageName(this.codiceIpa || Rule.AMMINISTRAZIONE_TRASPARENTE)
      .svgHeight(this.chartContainer.nativeElement.offsetHeight)  
      .data(this.data)
      .layout('left')
      .onNodeClick(d => {
        this.currentNode = d;
        this.tabRuleActive = true;
        this.tabPAActive = false;
      })
      .buttonContent(({ node, state }) => {
        return `<div class="w-100 h-100 border rounded bg-${node.data.buttonColor}">
        <div class="d-flex">
          <span class="h5 text-white">${node.data._directSubordinates}</span>
          <svg class="icon-light icon align-middle">${
          node.children
            ? `<use href="./bootstrap-italia/dist/svg/sprites.svg#it-minus-circle"></use>`
            : `<use href="./bootstrap-italia/dist/svg/sprites.svg#it-plus-circle"></use>`
        }</svg></div></div>`;
      })
      .nodeContent(function (d, i, arr, state) {
          let isTermLarge = d?.data?.term?.length > 60,
            isTermUltraLarge = d?.data?.term?.length > 200,
            classBox = !isTermLarge ? `h6`: `fw-bolder`,
            ultraLarge = isTermUltraLarge? `pt-0 px-1` : ``; 
          return `
          <div class="card-wrapper card-space hmin-100">
            <div class="card card-bg shadow-lg border border-${d.data.color} border-5">
              <div class="card-body pb-0 ${ultraLarge}">
                <span class="text-break d-flex ${classBox}">${d.data.term}</span>
                ${
                  d.data.status
                    ? `<span class="fst-italic text-${d.data.color}">${d.data.ruleStatus[d.data.status].ruletitle}</span>`
                    : ``
                }
                </div>
            </div>
          </div>
          `
      })
      .render();
  }

  zoomOut() {
    this.chart.zoomOut();
    return false;
  }

  zoomIn() {
    this.chart.zoomIn();
    return false;
  }

  exportImg(full: boolean) {
    Helpers.computedStyleToInlineStyle(
      this.chartContainer.nativeElement, { 
        recursive: true, 
        properties: ['color','height','width','box-sizing','background','border',
                    'font-size','margin-top','margin-bottom','padding','border-bottom'] 
      }
    );
    this.chart.exportImg({
      full: full,
      scale: 10,
      backgroundColor: "#5d7083" 
    });
    return false;
  }

  exportPdf() {
    Helpers.computedStyleToInlineStyle(
      this.chartContainer.nativeElement, { 
        recursive: true, 
        properties: ['color','height','width','box-sizing','background','border',
                    'font-size','margin-top','margin-bottom','padding','border-bottom'] 
      }
    );
    let filename = this.codiceIpa || Rule.AMMINISTRAZIONE_TRASPARENTE;
    this.chart.exportImg({
      save: false,
      scale: 10,
      backgroundColor: "#5d7083",
      onLoad: (base64) => {
        var pdf = new jsPDF({
          orientation: "landscape",
          format: 'a4'
        });
        var img = new Image();
        img.src = base64;
        img.onload = function () {
          pdf.addImage(
            img,
            'JPEG',
            5,
            5,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
          );
          pdf.save(`${filename}.pdf`);
        };
      },
    });
    return false;
  }

  swap() {
    this.chart.layout(["right","bottom","left","top"][this.index++%4]).render().fit();
    return false;
  }

  compactGraph() {
    this.chart.compact(!!(this.compact++%2)).render().fit();
    return false;
  }

  fit() {
    this.chart.fit();
    return false;
  }

  expandAll() {
    this.chart.expandAll();
    return false;
  }

  collapseAll() {
    this.chart.collapseAll();
    return false;
  }

  center() {        
    this.chart.setCentered(Rule.AMMINISTRAZIONE_TRASPARENTE).render();
    return false;
  }

  showErrorMessage(ruleName: string) {
    this.resultService.getAll({
      workflowId: this.filterFormSearch.value.workflowId,
      codiceIpa: this.codiceIpa,
      ruleName: `${ruleName}/child`, 
      size: 1,
      noCache: true
    }).subscribe((results: Result[]) => {
      if (results.length == 1 && results[0].errorMessage) {
        this.apiMessageService.sendMessage(MessageType.ERROR, results[0].errorMessage, NotificationPosition.Right);
      } else {
        this.apiMessageService.sendMessage(MessageType.ERROR, `it.result.errorNotFound`, NotificationPosition.Right);
      }
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.fromMap) {
      this.router.navigateByUrl(`/company-map?workflowId=${this.filterFormSearch.value.workflowId}&codiceIpa=${this.codiceIpa}`);
    }
    return false;
  }
    
  // -------------------------------
  // On Destroy.
  // -------------------------------

  public ngOnDestroy() {
    this.chart = undefined;
  }

}
