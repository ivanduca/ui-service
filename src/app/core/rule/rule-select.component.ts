import {Component, Input, OnInit, Output } from '@angular/core';
import { Rule, SelectRule } from '../rule/rule.model';
import { FormControl, FormGroup } from '@angular/forms';
import { RuleService } from './rule.service';

@Component({
    selector: 'app-rule-select',
    template: `
    <form *ngIf="form" [formGroup]="form">
        <ng-select 
            *ngIf="optionsRule" 
            [clearable]="false" 
            [items]="optionsRule" 
            bindLabel="text" 
            bindValue="value" 
            [formControlName]="controlName" 
            class="break-spaces" 
            [placeholder]="'it.rule.name'| translate">
          <ng-template ng-option-tmp let-item="item" let-index="index" let-search="searchTerm">
            <div class="d-flex">
                <span class="{{ item.class }} text-truncate pe-2">{{ item.text }}</span>
                <span *ngIf="item.level" class="ms-auto"><b>Liv.{{ item.level }}</b></span>
                <span *ngIf="!item.level && item.name" class="ms-auto {{ item.class }}"><b><i>{{ item.name }}</i></b></span>
            </div>
          </ng-template>  
        </ng-select>
    </form>
  `,
    standalone: false
})
export class RuleSelectComponent implements OnInit{

  constructor(
    private ruleService: RuleService
  ) {}
  @Input() optionsRule: Array<any>;

  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() value: string;

  ngOnInit(): void {
    this.form?.addControl(this.controlName, new FormControl(this.value));
  }
}
