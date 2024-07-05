import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectControlOption } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';
import { ConductorService } from '../conductor/conductor.service';
import { Workflow } from '../conductor/workflow.model';
import { DatePipe } from '@angular/common';
import { Status } from '../rule/status.enum';
import { RuleService } from '../rule/rule.service';
import { Rule, SelectRule } from '../rule/rule.model';
import { HttpParams } from '@angular/common/http';
import { ResultService } from '../result/result.service';
import * as saveAs from 'file-saver';
import { CodiceCategoria } from '../../common/model/codice-categoria.enum';

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './search.component.html',
  providers: [DatePipe]
})
export class SearchComponent implements OnInit {
  
  protected filterFormSearch: FormGroup;
  protected collapse: boolean = false;
  protected isLoadingCsv: boolean = false;
  options: Array<SelectControlOption> = [];
  optionsWorkflow: Array<SelectControlOption> = [];
  optionsStatus: Array<SelectControlOption> = [];
  optionsRule: Array<SelectControlOption> = [];
  optionsCategoria: Array<SelectControlOption> = [];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private conductorService: ConductorService,
              private ruleService: RuleService,
              private resultService: ResultService,
              private translateService: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              private datepipe: DatePipe,
              protected router: Router) {
    this.translateService.get('it').subscribe((labels: any) => {
      this.options.push({ value: 'company.codiceIpa', text: labels.company.codiceIpa });
      this.options.push({ value: 'company.denominazioneEnte', text: labels.company.denominazioneEnte });
      this.options.push({ value: 'createdAt,desc', text: labels.order.createdAt.desc });
      this.optionsStatus.push({value: '', text: '*', disabled: false});
      this.optionsRule.push({value: '', text: '*', selected: false});
      this.optionsWorkflow.push({value: '', text: '*', selected: false});
      this.optionsCategoria.push({ value: '', text: '*', selected: true});
    });
    Object.keys(CodiceCategoria).forEach((key) => {
      this.optionsCategoria.push({ value: key, text: CodiceCategoria[key]});
    });
  }

  isStatusDisabled(status: number, ruleName: string): boolean {
    if (ruleName === Rule.AMMINISTRAZIONE_TRASPARENTE) {
      return status == 404;
    } 
    return (status != 200 && status != 404);
  }

  manageOptionStatus(ruleName: string) {
    this.optionsStatus.forEach((option: any) => {
      option.disabled = this.isStatusDisabled(option.value, ruleName);
      if (this.filterFormSearch.value.status === option.value && option.disabled) {
        this.filterFormSearch.controls.status.patchValue('');
      }
    });    
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      let ruleName = queryParams.ruleName == '' ? '': queryParams.ruleName||Rule.AMMINISTRAZIONE_TRASPARENTE;
      let workflowId = queryParams.workflowId;
      this.filterFormSearch = this.formBuilder.group({
        workflowId: new FormControl(workflowId),
        ruleName: new FormControl(ruleName),
        status: new FormControl(queryParams.status||''),
        denominazioneEnte: new FormControl(),
        codiceFiscaleEnte: new FormControl(),
        codiceIpa: new FormControl(queryParams.codiceIpa),
        codiceCategoria: new FormControl(),
        sort: new FormControl(queryParams.sort),
      });
      this.filterFormSearch.valueChanges.subscribe((value: any) => {
        this.manageOptionStatus(value.ruleName);
      });  

      Object.values(Status).filter(key => !isNaN(Number(key))).forEach((key: number) => {
        let status = String(key);
        this.translateService.get(`it.rule.status.${status}`).subscribe((label: any) => {
          this.optionsStatus.push({
            value: status,
            text: label.ruletitle,
            disabled: this.isStatusDisabled(key, ruleName)
          });
        });
      });      
      this.ruleService.getRules().subscribe((rule) => {
        let rules: SelectRule[] = rule.getKeys(undefined, Rule.AMMINISTRAZIONE_TRASPARENTE, [], -1);
        Object.keys(rules).forEach((index) => {
          this.optionsRule.push({
            value: rules[index].key,
            text: rules[index].text,
            selected: rules[index].key === ruleName
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
            }),
            selected: workflow.workflowId === queryParams['workflowId']
          });
        });
        if (workflowId == undefined) {
          workflowId = workflows[0].workflowId;
          this.optionsWorkflow[0].selected = true;
          this.filterFormSearch.controls['workflowId'].patchValue(workflowId);
        }
      });
    });
  }

  downloadCsv() {
    this.isLoadingCsv = true;
    let httpParams = new HttpParams();
    const formValue = this.filterFormSearch.value;
    const fileName = this.filterFormSearch.value['ruleName'] || Rule.AMMINISTRAZIONE_TRASPARENTE;
    for (const key in formValue) {
      if (formValue[key] && formValue[key] !== null) {
        httpParams = httpParams.append(key, formValue[key]);
      }
    }
    httpParams = httpParams.append(`terse`, true);
    httpParams = httpParams.append(`sort`, this.filterFormSearch.value['sort']||`company.codiceIpa,id`);
    this.resultService.downloadCSV(httpParams).subscribe( (response: any) => {
      saveAs(response, `${fileName}.csv`);
      this.isLoadingCsv = false;
    });
    return false;
  }
}
