import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-show-text-modal',
    template: `
    @if (value) {
      <span class="me-1">
        <span>{{ label | translate }}</span>
        <a class="ms-1" [ngClass]="{'font-weight-bold': strong}" href="javascript:" (click)="modal.toggle()">{{ value }}</a>
      </span>
    }
    <it-modal #modal="itModal">
      <ng-container modalTitle>
        <svg class="icon icon-primary align-top">
          <use xlink:href="assets/vendor/sprite.svg#it-info-circle"></use>
        </svg>
        <h4 class="modal-title text-primary ps-1">{{modal_title}}</h4>
        <button type="button" class="btn close pull-right" aria-label="Close" (click)="modal.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </ng-container>
      <div class="modal-body" [innerHtml]="modal_text | safeHtml"></div>
      <ng-container footer>
        <button type="button" class="btn btn-outline-primary" (click)="modal.hide()">Close</button>
      </ng-container>
    </it-modal>
    `,
    standalone: false
})
export class ShowTextModalComponent {

  @Input() label;
  @Input() value;
  @Input() modal_title;
  @Input() modal_text;
  @Input() strong = true;

}
