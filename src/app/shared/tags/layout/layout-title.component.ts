import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-layout-title',
  template: `
    <div 
      class="d-flex justify-content-center shadow-none p-3 mb-4 bg-light pe-1 ps-1 pb-3 pt-3 mb-3 mt-n3 ms-n3 me-n3" 
      (click)="toggle(!collapsediv)"
      [ngClass]="{'btn btn-link': isCollapsable}">
      <div [ngClass]="{'ms-auto': isCollapsable}">
        <h1 *ngIf="title" class="text-center" [ngClass]="titleClass">{{ title | translate}}</h1>
        <h2 *ngIf="subTitle" class="mt-3 text-justify" [ngClass]="subTitleClass">{{ subTitle | translate}}</h2>
      </div>
      <div *ngIf="isCollapsable" class="ms-auto">
        <svg class="icon icon-primary icon-xl">
          <use *ngIf="collapsediv" xlink:href="assets/vendor/sprite.svg#it-expand"></use>
          <use *ngIf="!collapsediv" xlink:href="assets/vendor/sprite.svg#it-collapse"></use>
        </svg>
      </div>
    </div>
      `
})
export class LayoutTitleComponent implements OnInit{

  @Input() title = '';

  @Input() titleClass = '';

  @Input() subTitle = '';

  @Input() subTitleClass = '';

  @Input() isCollapsable = false;

  @Output() collapseEvent = new EventEmitter<boolean>();
  
  @Input() collapsediv: boolean = true; 

  toggle(value: boolean) {
    this.collapseEvent.emit(value);
    this.collapsediv = value; 
  }

  ngOnInit(): void {
    this.toggle(this.collapsediv);
  }
}
