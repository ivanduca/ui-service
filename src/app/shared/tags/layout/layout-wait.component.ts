import {Component, Input} from '@angular/core';


@Component({
    selector: 'app-layout-wait',
    template: `
    @if (!loaded) {
      <div class="text-center text-primary mt-5">
        <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
        <span class="sr-only">Loading...</span>
      </div>
    }
    `,
    standalone: false
})
export class LayoutWaitComponent {

  @Input() loaded: boolean;

}

