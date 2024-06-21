import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-url',
  template: `
    <span *ngIf="value" class="me-1">
      <span class="label-show-text">{{ label | translate }}</span>
      <a class="ms-1" [ngClass]="{'fw-bolder': strong}" href="{{url}}" [target]="target">{{ value }}</a>
    </span>
  `
})
export class ShowURLComponent {

  @Input() label;
  @Input() value;
  @Input() strong = false;
  @Input() target = '_blank';

  public get url() {
    if (this.value.indexOf('http') != -1) {
      return this.value;
    }
    return `//${this.value}`;
  }
}
