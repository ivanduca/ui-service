import { Component, Input } from '@angular/core';
import { Base } from '../../../common/model/base.model';

@Component({
  selector: 'app-show-multi',
  template: `
      <app-show-layout [label]="label">
        <div *ngIf="!values || values.length == 0"><em class="text-secondary">Nessun elemento associato</em></div>
        <ul class="list-group">
          <li class="list-group-item pt-1 pb-1" *ngFor="let value of values"> {{ value.getLabel() }}</li>
        </ul>
      </app-show-layout>
  `
})
export class ShowMultiComponent {

  @Input() label;
  @Input() values: Base[];

}
