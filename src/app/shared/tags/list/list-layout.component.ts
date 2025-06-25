import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Table} from '../../../common/model/table.model';
import { CommonService } from '../../../common/controller/common.service';

@Component({
    selector: 'app-list-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="px-1">
    
      @if (loading ) {
        <div class="text-center">
          Caricamento ...
          <i class="fa fa-spinner fa-pulse fa-fw"></i>
        </div>
      } @else {
        @if (count > 0) {
          <div >
            @if (!loading && showTotalOnTop && count > page_offset) {
              <app-list-pagination [showPage]="false" [page]="page" [count]="count" [page_offset]="page_offset" (onChangePage)="select($event)"></app-list-pagination>
            }
            <ul class="list-group" [ngClass]="classForDisplayList()">
              <ng-content></ng-content>
            </ul>
            @if (table) {
              <table class="table table-hover table-bordered table-light" [ngClass]="classForDisplayTable()">
                <thead class="table-secondary">
                  @for (key of table.keys; track key) {
                    <th> {{ key | translate }}</th>
                  }
                </thead>
                <tbody>
                  @for (row of table.rows; track row) {
                    <tr app-table-item (delete)="onDelete($event)" [noEdit]="noEdit"
                      [queryparams]="queryparams" [keys]="table.keys" [row]="row" [hasEditValidita]="hasEditValidita">
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        } @else {
          {{ 'no_item' | translate }}
        }
      }
    
    
      <!-- Paging -->
      @if (!loading) {
        <app-list-pagination [page]="page" [count]="count" [page_offset]="page_offset" (onChangePage)="select($event)"></app-list-pagination>
      }
    
    
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

