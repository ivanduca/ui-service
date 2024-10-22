import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './configuration.model';
import { Bs5UnixCronComponent, CronLocalization, Tab } from '@sbzen/ng-cron';
import { ItModalComponent, NotificationPosition } from 'design-angular-kit';
import { ApiMessageService, MessageType } from '../api-message.service';

import * as parser from 'cron-parser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-configuration',
  templateUrl: './main-configuration.component.html',
  styles: ``
})
export class MainConfigurationComponent implements OnInit, AfterViewInit {
  @ViewChild('cron') cronComponent: Bs5UnixCronComponent;
  @ViewChild('headerPopconfirmModal') headerPopconfirmModal: ItModalComponent;
  readonly activeTab = Tab.HOURS;
  readonly tabs = [Tab.HOURS, Tab.DAY, Tab.MONTH];
  readonly WORKFLOW_CRON_EXPRESSION = `workflow.cron.expression`;
  protected labels: any;
  protected cronValue: string;
  protected nextDate: Date;
  protected cronConfiguration: Configuration;
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
          label2: 'mese/i a partire da',
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
    private translateService: TranslateService,
    private configurationService: ConfigurationService,
    private apiMessageService: ApiMessageService,
    private elementRef: ElementRef                  
  ) {}

  ngOnInit(): void {
    this.translateService.get('it.configuration').subscribe((labels: any) => {
      this.labels = labels;
    });
    this.configurationService.getAll().subscribe((configurations: Configuration[]) => {
      configurations.forEach((conf: Configuration) => {
          if (conf.key === this.WORKFLOW_CRON_EXPRESSION) {
            this.cronConfiguration = conf;
            this.cronValue = conf.value;
          }
      });
    });
  }

  cronConfirm(): void {
    let cronExpression = parser.parseExpression(this.cronValue);
    if (cronExpression.fields.hour.length > 1) {
      this.apiMessageService.sendMessage(MessageType.ERROR, this.labels.cron.error, NotificationPosition.Top);
    } else {
      this.nextDate = cronExpression.next().toDate();
      this.headerPopconfirmModal.toggle();  
    }
  }

  cronSave(): void {
    let conf: Configuration = new Configuration();
    conf.id = this.cronConfiguration ? this.cronConfiguration.id: undefined;
    conf.application = `task-scheduler-service`;
    conf.profile = `default`;
    conf.label= this.labels.cron.title;
    conf.key = this.WORKFLOW_CRON_EXPRESSION;
    conf.value = this.cronValue;
    this.configurationService.save(conf).subscribe((result: any) => {
      this.cronConfiguration = result;
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
