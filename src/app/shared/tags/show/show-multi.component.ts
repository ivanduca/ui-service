import { Component, Input } from '@angular/core';
import { Base } from '../../../common/model/base.model';

@Component({
    selector: 'app-show-multi',
    template: `
      <app-show-layout [label]="label">
        @if (!values || values.length == 0) {
          <div><em class="text-secondary">Nessun elemento associato</em></div>
        }
        <ul class="list-group">
          @for (value of values; track value) {
            <li class="list-group-item pt-1 pb-1"> {{ value.getLabel() }}</li>
          }
        </ul>
      </app-show-layout>
      `,
    standalone: false
})
export class ShowMultiComponent {

  @Input() label;
  @Input() values: Base[];

}
