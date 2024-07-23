import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-text-popover',
  template: `
    <span *ngIf="value" class="d-flex gap-1 align-items-center">
      <span class="label-show-text">{{ label | translate }}</span>
      <span class="ms-1" [ngClass]="{'fw-bolder': strong}">{{ value }}</span>
      @if (popover_text) {
        <span
          [itPopover]="popover_text"
          [popoverTitle]="popover_title"
          popoverTrigger="hover"
          [popoverPlacement]="popover_placement">
          <it-icon 
            size="sm"
            [name]="icon" 
            class="ms-2 bg-light" 
            [color]="color">
          </it-icon>
          </span>  
      }
    </span>
  `
})
export class ShowTextPopoverComponent {

  @Input() label;
  @Input() value;
  @Input() popover_title;
  @Input() popover_text;
  @Input() popover_placement = 'right';
  @Input() strong = true;
  @Input() icon = "info-circle";
  @Input() color = "primary";

  constructor() {}
 
}
