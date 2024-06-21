import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-color',
  template: `
      <app-show-layout [strong]='strong' [label]="label">

        <span *ngIf="value">
          <div class="d-block" [ngStyle]="{'background-color': value, 'width': '25px'}">&nbsp;</div>
        </span>

        <span *ngIf="!value">
          <em class="text-secondary">Non presente</em>
        </span>
      </app-show-layout>
  `
})
export class ShowColorComponent {

  @Input() label;
  @Input() value;
  @Input() strong = true;

}
