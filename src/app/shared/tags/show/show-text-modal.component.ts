import {Component, Input, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-show-text-modal',
  template: `
    <span *ngIf="value" class="me-1">
      <span>{{ label | translate }}</span>
      <a class="ms-1" [ngClass]="{'font-weight-bold': strong}" href="javascript:" (click)="openModal(template)">{{ value }}</a>
    </span>
    <ng-template #template>
      <div class="modal-header">
        <svg class="icon icon-primary align-top">
          <use xlink:href="assets/vendor/sprite.svg#it-info-circle"></use>
        </svg>
        <h4 class="modal-title text-primary ps-1">{{modal_title}}</h4>
        <button type="button" class="btn close pull-right" aria-label="Close" (click)="modalRef.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" [innerHtml]="modal_text | safeHtml"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-primary" (click)="modalRef.hide()">Close</button>
      </div>
    </ng-template>
  `
})
export class ShowTextModalComponent {

  @Input() label;
  @Input() value;
  @Input() modal_title;
  @Input() modal_text;
  @Input() strong = true;
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-lg' }));
    return false;
  }
}
