import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {CommonService} from '../../../common/controller/common.service';

@Component({
  selector: 'app-list-pagination',
  template:
     `
        <div class="d-flex pt-1">
          <!-- Paging -->
          <div>
           <it-pagination
                *ngIf="showPage && count > page_offset"
                [boundaryLinks]="true" 
                [totalItems]="count" 
                [itemsPerPage]="page_offset"
                previousText="&lsaquo;" 
                nextText="&rsaquo;" 
                firstText="&laquo;" 
                lastText="&raquo;"
                (pageChanged)="pageChanged($event)"
                [(ngModel)]="currentPage"
                [rotate]="true" 
                [maxSize]="5">
            </it-pagination>
          </div>
          <div class="ms-auto">
            <!-- Recap -->
            <div *ngIf="count > 0" class="d-inline-block float-end" [ngClass]="{'mt-3': showPage && count > page_offset}">
              <small>
              {{ 'present' | translate }} <span class="font-weight-bold">{{ count | number: undefined : 'it-IT'}}</span> {{ 'occurrences' | translate}}.
                  {{ 'shown_from' | translate }} {{ showFrom() }} {{ 'shown_to' | translate }} {{ showTo() }}.
              </small>
            </div>
          </div>
        </div>  
    `,
})
export class ListPaginationComponent implements OnInit{

  @Input() page: 0;

  @Input() count = 0;

  @Input() showPage: boolean = true;

  @Input() page_offset = CommonService.PAGE_OFFSET;

  @Input() infiniteScroll = false;

  @Output() onChangePage = new EventEmitter();

  public currentPage: number;

  ngOnInit() {
    this.currentPage = this.page + 1;
  }

  pageChanged(page: number): void {
    if (this.currentPage != page) {
      this.onChangePage.emit(page - 1);
    }
  }

  public showFrom() {
    if (this.infiniteScroll) {
      return 1;
    } else {
      return this.page * this.page_offset + 1;
    }
  }

  public showTo() {
    const to = this.infiniteScroll ? (this.page + 1) * this.page_offset + 1 : this.showFrom() + this.page_offset;
    return to > this.count ? this.count : to - 1;
  }
}
