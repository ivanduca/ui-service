import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-show-children-modal',
  template: `
    
    <button class="btn {{buttonClass}}" (click)="openModal(template)" tooltip="{{'attach' | translate}}">
      <svg class="icon">
        <use xlink:href="assets/vendor/sprite.svg#it-download"></use>
      </svg>
    </button>

    <ng-template #template let-modal>
      <div class="modal-header">
        <h4 class="modal-title pull-left text-primary"><i class="fa fa-info-circle"></i> {{modal_title}}</h4>
        <button #close type="button" class="btn close pull-right" aria-label="Close" (click)="modalRef.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
         <children-list [show_date]="show_date" [parentId]="parentId" [typeId]="typeId" [queryName]="queryName"></children-list>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-primary" (click)="modalRef.hide()">{{'close' | translate}}</button>
      </div>
    </ng-template>
  `
})
export class ShowChildrenModalComponent {

  @Input() parentId;  
  @Input() buttonClass = 'text-dark p-1';
  @Input() label;
  @Input() value;
  @Input() typeId;
  @Input() queryName;
  @Input() modal_title;
  @Input() show_date = 'false';
  @ViewChild('close', {static: true}) close: ElementRef;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-xl' }));      
    return false;
  }

}
