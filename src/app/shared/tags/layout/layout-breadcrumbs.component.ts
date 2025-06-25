import {Component, Input} from '@angular/core';
import {Breadcrumbs} from '../../../common/model/breadcrumbs.model';

@Component({
    selector: 'app-layout-breadcrumbs',
    template: `
      @if (breadcrumbs) {
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-light mb-0">
            @for (breadcrumb of breadcrumbs.items; track breadcrumb) {
              <li class="breadcrumb-item" [ngClass]="{ 'active': breadcrumb.active }">
                @if (breadcrumb.active) {
                  <span><small>{{ breadcrumb.label | translate }}</small></span>
                }
                @if (!breadcrumb.active) {
                  <a [routerLink]="breadcrumb.route"><small>{{ breadcrumb.label | translate }}</small></a>
                }
              </li>
            }
          </ol>
        </nav>
      }
      `,
    standalone: false
})
export class LayoutBreadcrumbsComponent {

  @Input() breadcrumbs: Breadcrumbs;

}

