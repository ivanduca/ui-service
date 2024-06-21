import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-boolean',
  template: `
    <app-show-layout [strong]='strong' [label]="label">
        <span>
          {{ value.toString() | translate }}
        </span>
    </app-show-layout>
  `
})
export class ShowBooleanComponent {

  @Input() label;
  @Input() value;
  @Input() strong = true;
}
