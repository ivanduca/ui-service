import {Component, Input } from '@angular/core';
import { Workflow } from './workflow.model';
import { HttpParams } from '@angular/common/http';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Rule } from '../rule/rule.model';
import { ResultService } from '../result/result.service';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-workflow-card',
  template:
  `
    <it-card space="true" background="true">
      @if (!title) {
        <div class="d-flex bg-dark text-white legend h3 mb-2 justify-content-center">
          <span>{{'it.workflow.label' | translate: { startTime: workflow.startTime | date:'dd/MM/yyyy'} }}</span>
        </div>
      }
      <div class="category-top">
            <div class="d-flex justify-content-end">
            @if (title) {
                <div class="d-flex">
                    <a class="category" [routerLink]="['/search']" [queryParams]="{workflowId: workflow.workflowId, ruleName: 'amministrazione-trasparente'}">{{'it.workflow.label' | translate: { startTime: workflow.startTime | date:'dd/MM/yyyy'} }}</a>
                    @if (!workflow.isTotalCompleted()) {<div class="ps-2"><it-spinner small="true"></it-spinner></div>}    
                </div>
            }
            @if (workflow.status !== 'RUNNING') {
                <div class="ms-auto">
                @if (workflow.status == 'COMPLETED') {
                    <a href="" (click)="downloadCsv(workflow.workflowId)" class="align-top me-1">
                    <it-icon *ngIf="!isLoadingCsv" name="file-csv" class="bg-light" color="success"></it-icon>
                    <it-spinner *ngIf="isLoadingCsv" small="true" double="true"></it-spinner>
                    </a>
                }
                <span 
                    itPopover="Concluso il {{workflow.endTime | date:'dd/MM/yyyy HH:mm:ss'}} in {{workflow.executionTime | durationFormat}}"  
                    popoverPlacement="top"
                    popoverTrigger="hover" 
                    [itBadge]="workflow.badge" 
                    class="h6 align-top">
                    <div class="d-flex">
                    <div>{{'it.workflow.status.'+ workflow.status | translate}}</div>
                    </div>                   
                </span>
                </div>
            } 
            @if (workflow.status == 'RUNNING'){
                <button [itButton]="'outline-primary'" size="xs" class="ms-auto align-top" (click)="workflowTotalElements(workflow)">
                <span>{{'it.workflow.status.'+ workflow.status | translate}}</span>
                <span class="visually-hidden">Aggiorna i dati</span>
                </button>                  
            }
            </div> 
        </div>
        <div class="card-text">
            <it-list>
            <it-list-item [routerLink]="['/search']" [queryParams]="{workflowId: workflow.workflowId, ruleName: 'amministrazione-trasparente'}" href="#" iconLeft="true">
                <span class="fst-italic card-text">{{'it.rule.status.all' | translate}}</span>
                <ng-container multiple>                     
                <span @scale [itBadge]="'primary'" [rounded]="true" class="text-sm-left">{{ workflow.totalResult| number: undefined : 'it-IT' }}</span>
                </ng-container>
            </it-list-item>
            <it-list-item [routerLink]="['/search']" [queryParams]="{workflowId: workflow.workflowId, ruleName: 'amministrazione-trasparente', status: 200}" href="#" iconLeft="true">
                <span class="fst-italic card-text">{{'it.rule.status.200.title' | translate}}</span>
                <ng-container multiple>
                <span @scale [itBadge]="'success'" [rounded]="true" class="text-sm-left">{{ workflow.getResultFromStatus('200') | number: undefined : 'it-IT' }}</span>
                </ng-container>
            </it-list-item>
            <it-list-item [routerLink]="['/search']" [queryParams]="{workflowId: workflow.workflowId, ruleName: 'amministrazione-trasparente', status: 202}" href="#" iconLeft="true">
                <span class="fst-italic card-text">{{'it.rule.status.202.title' | translate}}</span>
                <ng-container multiple>                    
                <span @scale [itBadge]="'warning'" [rounded]="true" class="text-sm-left">{{ workflow.getResultFromStatus('202') | number: undefined : 'it-IT' }}</span>
                </ng-container>
            </it-list-item>
            <it-list-item [routerLink]="['/search']" [queryParams]="{workflowId: workflow.workflowId, ruleName: 'amministrazione-trasparente', status: 400}" href="#" iconLeft="true">
                <span class="fst-italic card-text">{{'it.rule.status.400.title' | translate}}</span>
                <ng-container multiple>
                <span @scale [itBadge]="'danger'" [rounded]="true" class="text-sm-left">{{ workflow.getResultFromStatus('400') | number: undefined : 'it-IT' }}</span>
                </ng-container>
            </it-list-item>
            <it-list-item [routerLink]="['/search']" [queryParams]="{workflowId: workflow.workflowId, ruleName: 'amministrazione-trasparente', status: 407}" href="#" iconLeft="true">
                <span class="fst-italic card-text">{{'it.rule.status.407.title' | translate}}</span>
                <ng-container multiple>
                <span @scale class="badge rounded-pill complementary-1-bg-b1 text-sm-left">{{ workflow.getResultFromStatus('407') | number: undefined : 'it-IT' }}</span>
                </ng-container>
            </it-list-item>
            <it-list-item [routerLink]="['/search']" [queryParams]="{workflowId: workflow.workflowId, ruleName: 'amministrazione-trasparente', status: 500}" href="#" iconLeft="true">
                <span class="fst-italic card-text">{{'it.rule.status.500.title' | translate}}</span>
                <ng-container multiple>
                <span @scale class="badge rounded-pill complementary-1-bg-a12 text-sm-left">{{ workflow.getResultFromStatus('500') | number: undefined : 'it-IT' }}</span>
                </ng-container>
            </it-list-item>
            </it-list>  
        </div>
        @if (workflow.status !== 'RUNNING') {
          <a class="read-more" [routerLink]="['/company-map']" [queryParams]="{workflowId: workflow.workflowId, ruleName:'amministrazione-trasparente'}">
              <span class="text">Leggi di più <span class="visually-hidden">Leggi di più ....</span></span>
              <it-icon name="arrow-right"></it-icon>
          </a>
        }
    </it-card>
  `,
  animations: [
    trigger('scale', [
      transition('void => *', animate('500ms ease-in-out', keyframes([
        style({ transform: 'scale(0.3)' }),
        style({ transform: 'scale(1)' })
      ]))) 
    ])
  ]
})
export class WorkflowCardComponent {

  constructor(
    private resultService: ResultService
  ) {}
  isLoadingCsv: boolean = false;

  @Input() workflow: Workflow;
  @Input() title: boolean = true;

  downloadCsv(workflowId: string) {
    this.isLoadingCsv = true;
    let httpParams = new HttpParams();
    httpParams = httpParams.append(`workflowId`, workflowId);
    httpParams = httpParams.append(`terse`, true);
    httpParams = httpParams.append(`sort`, `company.codiceIpa,id`);
    this.resultService.downloadCSV(httpParams).subscribe( (response: any) => {
      saveAs(response, `${Rule.AMMINISTRAZIONE_TRASPARENTE}.csv`);
      this.isLoadingCsv = false;
    });
    return false;
  }


  public workflowTotalElements(workflow: Workflow) {
    workflow.resultCount = undefined;
    this.resultService.getWorkflowMap(Rule.AMMINISTRAZIONE_TRASPARENTE, [workflow.workflowId], true).subscribe((result: any) => {
        workflow.resultCount = result[workflow.workflowId];
    });
  }

}
