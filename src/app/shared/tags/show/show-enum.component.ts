import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-show-enum',
    template: `
      <app-show-layout [label]="label">
        @if (enumerate) {
          <span> {{ enumerate.getEnumValue() | translate }}</span>
        }
        @if (!enumerate) {
          <span> {{ 'not_assigned' | translate }}</span>
        }
      </app-show-layout>
      `,
    standalone: false
})
export class ShowEnumComponent {

  @Input() label;

  @Input() enumerate;

}
