import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-show-layout',
    template: `
    <div class="row mt-3 mb-3">
      <div class="col-sm-2 text-end">
        @if (strong) {
          <strong> {{ label | translate }} </strong>
        }
        @if (!strong) {
          <span> {{ label | translate }} </span>
        }
      </div>
      <div class="col-sm-10">
        <ng-content></ng-content>
      </div>
    </div>
    `,
    standalone: false
})
export class ShowLayoutComponent {

  @Input() label = 'Field';
  @Input() strong = true;

}

