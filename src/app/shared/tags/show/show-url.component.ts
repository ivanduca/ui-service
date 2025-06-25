import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-show-url',
    template: `
    <span *ngIf="value" class="me-1">
      <span class="label-show-text">{{ label | translate }}</span>
      <a class="ms-1 multiline-truncate" [style.color]="fill" [ngClass]="{'fw-bolder': strong}" href="{{url}}" [target]="target">{{ value }}</a>
    </span>
  `,
    styles: `
    .multiline-truncate {
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Numero di righe da mostrare */
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      max-width: 100%;
    }  
  `,
    standalone: false
})
export class ShowURLComponent {

  @Input() label;
  @Input() fill;
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
