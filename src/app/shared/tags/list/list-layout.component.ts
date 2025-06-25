import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Table} from '../../../common/model/table.model';
import { CommonService } from '../../../common/controller/common.service';

@Component({
    selector: 'app-list-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="px-1">

        <div *ngIf="loading ; else results_table" class="text-center">
          Caricamento ...
          <i class="fa fa-spinner fa-pulse fa-fw"></i>
        </div>

        <ng-template #results_table>
          <div *ngIf="count > 0; else nessun_item" >
            <app-list-pagination *ngIf="!loading && showTotalOnTop && count > page_offset" [showPage]="false" [page]="page" [count]="count" [page_offset]="page_offset" (onChangePage)="select($event)"></app-list-pagination>

            <ul class="list-group" [ngClass]="classForDisplayList()">
              <ng-content></ng-content>
            </ul>

            <table *ngIf="table" class="table table-hover table-bordered table-light" [ngClass]="classForDisplayTable()">
              <thead class="table-secondary">
              <th *ngFor="let key of table.keys"> {{ key | translate }}</th>
              </thead>
              <tbody>
              <tr *ngFor="let row of table.rows" app-table-item (delete)="onDelete($event)" [noEdit]="noEdit"
                  [queryparams]="queryparams" [keys]="table.keys" [row]="row" [hasEditValidita]="hasEditValidita">
              </tr>
              </tbody>
            </table>

          </div>

          
        </ng-template>

        <!-- Paging -->
        <app-list-pagination *ngIf="!loading" [page]="page" [count]="count" [page_offset]="page_offset" (onChangePage)="select($event)"></app-list-pagination>

        <ng-template #nessun_item style="text-align: center;"> {{ 'no_item' | translate }}</ng-template>

    </div>
    `,
    standalone: false
})
export class ListLayoutComponent {

  @Input() table: Table = null;

  @Input() loading : boolean;

  @Input() items = [];

  @Input() page: 0;

  @Input() count = 0;

  @Input() page_offset = CommonService.PAGE_OFFSET;

  @Input() queryparams = {};

  @Input() hasEditValidita = false;

  @Input() noEdit = false;

  @Input() showTotalOnTop = true;

  @Output() onChangePage = new EventEmitter();

  @Output() delete = new EventEmitter();


  public select(i: number) {
    this.onChangePage.emit(i);
  }

  public classForDisplayList() {
    if (this.table) {
      return {
        'd-block': true,
        'd-md-none': true
      };
    }
    return {};
  }

  public classForDisplayTable() {
    if (this.table) {
      return {
        'd-none': true,
        'd-md-table': true
      };
    }
    return {};
  }

  public onDelete(event) {
    this.delete.emit(event);
  }
}

