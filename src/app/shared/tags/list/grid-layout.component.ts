import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Table } from '../../../common/model/table.model';
import { CommonService } from '../../../common/controller/common.service';

@Component({
    selector: 'app-grid-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="container">

        <div *ngIf="loading" class="text-center">
          Caricamento ...
          <it-spinner small="true" double="true"></it-spinner>
        </div>

        <div *ngIf="count > 0">
          <app-list-pagination *ngIf="!loading && showTotalOnTop && count > page_offset" [infiniteScroll]="infiniteScroll" [showPage]="showPageOnTop" [page]="page" [count]="count" [page_offset]="page_offset" (onChangePage)="select($event)"></app-list-pagination>

          <div class="row row-eq-height">
            <ng-content></ng-content>
          </div>
          <div *ngIf="loading && infiniteScroll" class="text-center">
            Caricamento ...
            <it-spinner small="true" double="true"></it-spinner>
          </div>
        </div>

        <!-- Paging -->
        <app-list-pagination *ngIf="!loading" [showPage]="showPage" [page]="page" [infiniteScroll]="infiniteScroll" [count]="count" [page_offset]="page_offset" (onChangePage)="select($event)"></app-list-pagination>

        <div *ngIf="!loading && count == 0" class="alert alert-warning text-monospace" innerHtml="{{ noItem | translate }}"></div>

    </div>
    `,
    standalone: false
})
export class GridLayoutComponent {

  @Input() table: Table = null;

  @Input() loading : boolean;

  @Input() noItem : string = 'no_item';

  @Input() items = [];

  @Input() page: 0;

  @Input() count = 0;

  @Input() showPage = true;

  @Input() infiniteScroll = false;

  @Input() page_offset = CommonService.PAGE_OFFSET;

  @Input() queryparams = {};

  @Input() hasEditValidita = false;

  @Input() noEdit = false;

  @Input() showTotalOnTop = true;

  @Input() showPageOnTop = false;

  @Output() onChangePage = new EventEmitter();

  @Output() delete = new EventEmitter();


  public select(i: number) {
    this.onChangePage.emit(i);
  }

  public onDelete(event) {
    this.delete.emit(event);
  }
}

