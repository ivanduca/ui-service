import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './configuration.model';
import { Bs5UnixCronComponent, CronLocalization, Tab } from '@sbzen/ng-cron';
import { ItModalComponent, NotificationPosition, SelectControlOption } from 'design-angular-kit';
import { ApiMessageService, MessageType } from '../api-message.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CodiceCategoria } from '../../common/model/codice-categoria.enum';
import { Rule, SelectRule } from '../rule/rule.model';
import { environment } from '../../../environments/environment';

import * as parser from 'cron-parser';
import { RuleService } from '../rule/rule.service';
import { ConductorService } from '../conductor/conductor.service';
import { Workflow } from '../conductor/workflow.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main-conf',
  templateUrl: './main-conf.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: `
    .callout-highlight {
      overflow: unset !important;
    }
  `,
  providers: [DatePipe]  
})
export class MainConfigurationComponent implements OnInit, AfterViewInit {
  @ViewChild('cron') cronComponent: Bs5UnixCronComponent;
  @ViewChild('headerPopconfirmModal') headerPopconfirmModal: ItModalComponent;
  
  readonly activeTab = Tab.HOURS;
  readonly tabs = [Tab.HOURS, Tab.DAY, Tab.MONTH];
  readonly WORKFLOW_CRON_EXPRESSION = `workflow.cron.expression`;
  readonly WORKFLOW_CRON_URL = `workflow.cron.url`;
  readonly WORKFLOW_CRON_BODY = `workflow.cron.body`;
  readonly WORKFLOW_NUMBER_PRESERVE = `workflow.number.preserve`;
  readonly WORKFLOW_ID_PRESERVE = `workflow.id.preserve`;

  protected labels: any;
  protected cronValue: string;
  protected cronConfiguration: Configuration;
  protected workflowURL: string;
  protected workflowURLid: number;

  protected workflowBODYForm: FormGroup;
  protected workflowBODYid: number;
  protected optionsCategoria: Array<SelectControlOption> = [];
  protected optionsRule: Array<any>;

  protected optionsWorkflow: Array<SelectControlOption> = [];

  protected number_workflows_preserve_id: number;
  protected workflow_id_preserve_id: number;

  readonly localization: CronLocalization = {
    common: {
      month: {
        january: 'Gennaio',
        february: 'Febbraio',
        march: 'Marzo',
        april: 'Aprile',
        may: 'Maggio',
        june: 'Giugno',
        july: 'Luglio',
        august: 'Agosto',
        september: 'Settembre',
        october: 'Ottobre',
        november: 'Novembre',
        december: 'Dicembre'
      },
      dayOfWeek: {
        sunday: 'Domenica',
        monday: 'Lunedì',
        tuesday: 'Martedì',
        wednesday: 'Mercoledì',
        thursday: 'Giovedì',
        friday: 'Venerdi',
        saturday: 'Sabato'
      },
      dayOfMonth: {
        '1st': '1°',
        '2nd': '2°',
        '3rd': '3°',
        '4th': '4°',
        '5th': '5°',
        '6th': '6°',
        '7th': '7°',
        '8th': '8°',
        '9th': '9°',
        '10th': '10°',
        '11th': '11°',
        '12th': '12°',
        '13th': '13°',
        '14th': '14°',
        '15th': '15°',
        '16th': '16°',
        '17th': '17°',
        '18th': '18°',
        '19th': '19°',
        '20th': '20°',
        '21st': '21°',
        '22nd': '22°',
        '23rd': '23°',
        '24th': '24°',
        '25th': '25°',
        '26th': '26°',
        '27th': '27°',
        '28th': '28°',
        '29th': '29°',
        '30th': '30°',
        '31st': '31°'
      }      
    },
    tabs: {
      hours: 'Ore',
      day: 'Giorni',
      month: 'Mesi'
    },
    unix: {
      day: {
        every: {
          label: 'Ogni giorno'
        },
        dayOfWeekIncrement: {
          label1: 'Ogni',
          label2: 'giorno/i da'
        },
        dayOfMonthIncrement: {
          label1: 'Ogni',
          label2: 'giorno/i del mese'
        },
        dayOfWeekAnd: {
          label: 'Giorno specifico della settimana (scegli uno o più)'
        },
        dayOfMonthAnd: {
          label: 'Giorno specifico del mese (scegli uno o più)'
        },
      },
      month: {
        every: {
          label: 'Ogni mese'
        },
        increment: {
          label1: 'Ogni',
          label2: 'mese/i',
        },
        and: {
          label: 'Mese specifico (scegli uno o più)'
        },
        range: {
          label1: 'Ogni mese tra il mese',
          label2: 'e mese'
        }
      },
      hour: {
        every: {
          label: 'Ogni ora'
        },
        increment: {
          label1: 'Ogni',
          label2: 'ora/e a partire dalle ore',
        },
        and: {
          label: 'Ora specifica (sceglierne una)'
        },
        range: {
          label1: 'Ogni ora tra le ore',
          label2: 'e ora'
        }
      }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private configurationService: ConfigurationService,
    private apiMessageService: ApiMessageService,
    private ruleService: RuleService,
    private conductorService: ConductorService,
    private datepipe: DatePipe,
    private elementRef: ElementRef                  
  ) {}

  ngOnInit(): void {
    this.translateService.get('it.configuration').subscribe((labels: any) => {
      this.labels = labels;
    });
    Object.keys(CodiceCategoria).forEach((key) => {
      this.optionsCategoria.push({ value: key, text: CodiceCategoria[key]});
    });
    this.ruleService.getRules().subscribe((resultRules: Map<String, Rule>) => {
      this.optionsRule = [];
      let rule = resultRules.get(Rule.AMMINISTRAZIONE_TRASPARENTE);
      let rules: SelectRule[] = rule.getKeys(undefined, undefined, Rule.AMMINISTRAZIONE_TRASPARENTE, [], -1);
      Object.keys(rules).forEach((index) => {
        this.optionsRule.push({
          value: rules[index].key,
          text: rules[index].text,
          level: rules[index].level,
          class: `ps-${rules[index].level} fs-${rules[index].level + 3}`
        });
      });
    });
    this.conductorService.getAll({
      includeClosed: true,
      includeTasks: false
    }).subscribe((workflows: Workflow[]) => {
      workflows.forEach((workflow: Workflow) => {
        this.optionsWorkflow.push({
          value: workflow.workflowId,
          text: this.translateService.instant('it.workflow.text', {
            startTime: this.datepipe.transform(workflow.startTime, 'dd/MM/yyyy HH:mm:ss'),
            status: this.translateService.instant(`it.workflow.status.${workflow.status}`)
          })
        });
      });
    });
    this.workflowBODYForm = this.formBuilder.group({
      page_size: new FormControl(1000),
      codice_categoria: new FormControl(''),
      codice_ipa: new FormControl(''),
      id_ipa_from: new FormControl(0),
      parent_workflow_id: new FormControl(''),
      execute_child: new FormControl(true),
      crawler_save_object: new FormControl(false),
      crawler_save_screenshot: new FormControl(false),
      rule_name: new FormControl(Rule.AMMINISTRAZIONE_TRASPARENTE),
      connection_timeout: new FormControl(30000),
      read_timeout: new FormControl(30000),
      connection_timeout_max: new FormControl(60000),
      read_timeout_max: new FormControl(60000),
      crawler_child_type: new FormControl(`START_WORKFLOW`),
      result_base_url: new FormControl(`${environment.resultApiUrl}result-service/v1/results`),
      crawler_uri: new FormControl(environment.crawlerApiUrl),
      number_workflows_preserve: new FormControl(3),
      workflow_id_preserve: new FormControl('')
    });
    this.configurationService.getAll().subscribe((configurations: Configuration[]) => {
      configurations.forEach((conf: Configuration) => {
          if (conf.key === this.WORKFLOW_CRON_EXPRESSION) {
            this.cronConfiguration = conf;
            this.cronValue = conf.value;
          }
          if (conf.key === this.WORKFLOW_CRON_URL) {
            this.workflowURL = conf.value;
            this.workflowURLid = conf.id;
          }
          if (conf.key === this.WORKFLOW_NUMBER_PRESERVE) {
            this.workflowBODYForm.controls.number_workflows_preserve.patchValue(Number(conf.value));
            this.number_workflows_preserve_id = conf.id;
          }
          if (conf.key === this.WORKFLOW_ID_PRESERVE) {
            this.workflowBODYForm.controls.workflow_id_preserve.patchValue(conf.value);
            this.workflow_id_preserve_id = conf.id;
          }
          if (conf.key === this.WORKFLOW_CRON_BODY) {
            this.workflowBODYid = conf.id;
            let jsonvalue = JSON.parse(conf.value);
            this.workflowBODYForm.controls.page_size.patchValue(jsonvalue.input.page_size);
            this.workflowBODYForm.controls.codice_categoria.patchValue(jsonvalue.input.codice_categoria);
            this.workflowBODYForm.controls.codice_ipa.patchValue(jsonvalue.input.codice_ipa);
            this.workflowBODYForm.controls.id_ipa_from.patchValue(jsonvalue.input.id_ipa_from);
            this.workflowBODYForm.controls.parent_workflow_id.patchValue(jsonvalue.input.parent_workflow_id);
            this.workflowBODYForm.controls.execute_child.patchValue(jsonvalue.input.execute_child);
            this.workflowBODYForm.controls.crawler_save_object.patchValue(jsonvalue.input.crawler_save_object);
            this.workflowBODYForm.controls.crawler_save_screenshot.patchValue(jsonvalue.input.crawler_save_screenshot);
            this.workflowBODYForm.controls.rule_name.patchValue(jsonvalue.input.rule_name);
            this.workflowBODYForm.controls.connection_timeout.patchValue(jsonvalue.input.connection_timeout);
            this.workflowBODYForm.controls.read_timeout.patchValue(jsonvalue.input.read_timeout);
            this.workflowBODYForm.controls.connection_timeout_max.patchValue(jsonvalue.input.connection_timeout_max);
            this.workflowBODYForm.controls.read_timeout_max.patchValue(jsonvalue.input.read_timeout_max);
            this.workflowBODYForm.controls.crawler_child_type.patchValue(jsonvalue.input.crawler_child_type);
            this.workflowBODYForm.controls.result_base_url.patchValue(jsonvalue.input.result_base_url);
            this.workflowBODYForm.controls.crawler_uri.patchValue(jsonvalue.input.crawler_uri);      
          }  
      });
    });
  }

  cronConfirm(): void {
    let cronExpression = parser.parseExpression(this.cronValue);
    if (cronExpression.fields.hour.length > 1) {
      this.apiMessageService.sendMessage(MessageType.ERROR, this.labels.cron.error, NotificationPosition.Top);
    } else {
      this.headerPopconfirmModal.toggle();  
    }
  }

  get nextDate(): Date {
    if (this.cronValue) {
      let cronExpression = parser.parseExpression(this.cronValue);
      return cronExpression.next().toDate();  
    }
    return undefined;
  }

  get nextNextDate(): Date {
    if (this.cronValue) {
      let cronExpression = parser.parseExpression(this.cronValue);
      cronExpression.next();
      return cronExpression.next().toDate();  
    }
    return undefined;
  }

  cronSave(): void {
    let conf: Configuration = new Configuration();
    conf.id = this.cronConfiguration ? this.cronConfiguration.id: undefined;
    conf.application = `task-scheduler-service`;
    conf.profile = `default`;
    conf.key = this.WORKFLOW_CRON_EXPRESSION;
    conf.value = this.cronValue;
    this.configurationService.save(conf).subscribe((result: any) => {
      this.cronConfiguration = result;
    });    
  }

  cronConfirmWorkflowURL(): void {
    let conf: Configuration = new Configuration();
    conf.id = this.workflowURLid;
    conf.application = `task-scheduler-service`;
    conf.profile = `default`;
    conf.key = this.WORKFLOW_CRON_URL;
    conf.value = this.workflowURL;
    this.configurationService.save(conf).subscribe((result: any) => {
      this.workflowURLid = result.id;
      this.workflowURL = result.value;
    });
  }

  cronConfirmWorkflowBODY(): void {
    let conf: Configuration = new Configuration();
    conf.id = this.workflowBODYid;
    conf.application = `task-scheduler-service`;
    conf.profile = `default`;
    conf.key = this.WORKFLOW_CRON_BODY;
    conf.value = JSON.stringify({
      name: ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW,
      correlationId: ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW,
      version: 1,
      input: {
        page_size: this.workflowBODYForm.controls.page_size.value,
        codice_categoria: this.workflowBODYForm.controls.codice_categoria.value||'',
        codice_ipa: "",
        id_ipa_from: 0,
        parent_workflow_id: "",
        execute_child: this.workflowBODYForm.controls.execute_child.value,
        crawler_save_object: this.workflowBODYForm.controls.crawler_save_object.value,
        crawler_save_screenshot: this.workflowBODYForm.controls.crawler_save_screenshot.value,
        rule_name: this.workflowBODYForm.controls.rule_name.value,
        connection_timeout: this.workflowBODYForm.controls.connection_timeout.value,
        read_timeout: this.workflowBODYForm.controls.read_timeout.value,
        connection_timeout_max: this.workflowBODYForm.controls.connection_timeout_max.value,
        read_timeout_max: this.workflowBODYForm.controls.read_timeout_max.value,
        crawler_child_type: this.workflowBODYForm.controls.crawler_child_type.value,
        result_base_url: this.workflowBODYForm.controls.result_base_url.value,
        crawler_uri: this.workflowBODYForm.controls.crawler_uri.value    
      }   
    });
    this.configurationService.save(conf, true).subscribe((result: any) => {
      this.workflowBODYid = result.id;
      // Comunico il numero di flussi da conservare
      conf.id = this.number_workflows_preserve_id;
      conf.key = this.WORKFLOW_NUMBER_PRESERVE;
      conf.value = this.workflowBODYForm.controls.number_workflows_preserve.value;
      this.configurationService.save(conf, true).subscribe((result: any) => {
        console.log(result);
        // Comunico l'id dell'eventuale flusso da conservare
        conf.id = this.workflow_id_preserve_id;
        conf.key = this.WORKFLOW_ID_PRESERVE;
        conf.value = this.workflowBODYForm.controls.workflow_id_preserve.value;
        this.configurationService.save(conf).subscribe((result: any) => {
          console.log(result);
        });
      });
    });
  }

  ngAfterViewInit(): void {
    this.onTabChanged(Tab.HOURS);
  }

  onTabChanged(tab: Tab): void {
    if (tab === Tab.HOURS) {
      ['c-every-option','c-increment-option','c-range-option'].forEach((className: string) => {
        let everyOption: any[] = this.elementRef.nativeElement.getElementsByClassName(className);
        if (everyOption.length !== 0) {
          everyOption[0].setAttribute('disabled', true);
        }  
      });
    }
  }


}
