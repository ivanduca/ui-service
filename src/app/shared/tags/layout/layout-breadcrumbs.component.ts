import {Component, Input} from '@angular/core';
import {Breadcrumbs} from '../../../common/model/breadcrumbs.model';

@Component({
  selector: 'app-layout-breadcrumbs',
  template: `
      <nav *ngIf="breadcrumbs" aria-label="breadcrumb">
          <ol class="breadcrumb bg-light mb-0">
              <li *ngFor="let breadcrumb of breadcrumbs.items" class="breadcrumb-item" [ngClass]="{ 'active': breadcrumb.active }">
                  <span *ngIf="breadcrumb.active"><small>{{ breadcrumb.label | translate }}</small></span>
                  <a *ngIf="!breadcrumb.active" [routerLink]="breadcrumb.route"><small>{{ breadcrumb.label | translate }}</small></a>
              </li>
          </ol>
      </nav>
      `
})
export class LayoutBreadcrumbsComponent {

  @Input() breadcrumbs: Breadcrumbs;

}

