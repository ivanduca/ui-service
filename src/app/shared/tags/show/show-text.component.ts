import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-text',
  template: `
    <span *ngIf="value" class="me-1">
      <span class="label-show-text">{{ label | translate }}</span>
      @if(isArray && value.length > 0) {
        <div class="link-list-wrapper">
          <ul class="link-list">
            @for (v of value; track v) {
              <li [ngClass]="{'fw-bolder': strong}">{{ v }}</li>
            }
          </ul>
        </div>
      }
      @if(!isArray) {
        <span class="ms-1" [ngClass]="{'fw-bolder': strong}">{{ value }}</span>
      }
    </span>
  `
})
export class ShowTextComponent {

  @Input() label;
  @Input() value;
  @Input() strong = true;

  get isArray(): boolean {
    return Array.isArray(this.value);
  }

}
