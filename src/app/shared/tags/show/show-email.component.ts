import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-email',
  template: `
    <span *ngIf="value" class="me-1">
      <span class="label-show-text">{{ label | translate }}</span>
      <a class="ms-1 multiline-truncate" [ngClass]="{'fw-bolder': strong}" href="{{url}}" [target]="target">{{ value }}</a>
    </span>
  `,
  styles: `
    .multiline-truncate {
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Numero di righe da mostrare */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }  
  `
})
export class ShowEMailComponent {

  @Input() label;
  @Input() value;
  @Input() strong = false;
  @Input() target = '_blank';

  public get url() {
    return `mailto:${this.value}`;
  }
}
