import {Component} from '@angular/core';

@Component({
  selector: 'app-list-header-layout',
  template:
     `
    <div class="px-2">
      <div class="ps-0 pe-0 mb-2">
        <ng-content></ng-content>
      </div>
    </div>
    `,
})
export class ListHeaderLayoutComponent {

}

