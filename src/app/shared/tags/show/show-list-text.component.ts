import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-show-list-text',
    template: `
    @if (value) {
      <it-list-item>
        @if (url) {
          <app-show-url [label]="label" [value]="value"></app-show-url>
        }
        @if (!url) {
          <app-show-text [label]="label" [value]="value"></app-show-text>
        }
      </it-list-item>
    }
    `,
    standalone: false
})
export class ShowListTextComponent {

  @Input() label;
  @Input() url: boolean = false;
  @Input() value;
  @Input() strong = true;
}
