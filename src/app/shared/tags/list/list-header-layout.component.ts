import {Component} from '@angular/core';

@Component({
  selector: 'app-list-header-layout',
  template:
     `
    <div class="px-2">
      <div class="pl-0 pr-0 mb-2 col-12">
        <ng-content></ng-content>
      </div>
    </div>
    `,
})
export class ListHeaderLayoutComponent {

}

