import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-enum',
  template: `
      <app-show-layout [label]="label">
        <span *ngIf="enumerate"> {{ enumerate.getEnumValue() | translate }}</span>
        <span *ngIf="!enumerate"> {{ 'not_assigned' | translate }}</span>
      </app-show-layout>
  `
})
export class ShowEnumComponent {

  @Input() label;

  @Input() enumerate;

}
