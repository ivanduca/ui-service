import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-text',
  template: `
    <span *ngIf="value" class="me-1">
      <span class="label-show-text">{{ label | translate }}</span>
      <span class="ms-1" [ngClass]="{'fw-bolder': strong}">{{ value }}</span>
    </span>
  `
})
export class ShowTextComponent {

  @Input() label;
  @Input() value;
  @Input() strong = true;
}
