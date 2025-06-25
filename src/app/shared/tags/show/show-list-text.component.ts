import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-show-list-text',
    template: `
    <it-list-item *ngIf="value">
      @if (url) {
        <app-show-url [label]="label" [value]="value"></app-show-url>
      }
      @if (!url) {
        <app-show-text [label]="label" [value]="value"></app-show-text>
      }
    </it-list-item>
  `,
    standalone: false
})
export class ShowListTextComponent {

  @Input() label;
  @Input() url: boolean = false;
  @Input() value;
  @Input() strong = true;
}
