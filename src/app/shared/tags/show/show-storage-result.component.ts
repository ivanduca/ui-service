import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import { StorageData } from '../../../core/result/result.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-storage-result',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  styles:`
    ul.nav-tabs {
      position: sticky !important;
      top: 0;
    }
  `, 
  template:
  `
    @if (screenshot && storageData?.screenshotId) {
      <a itButton="outline-warning" size="xs" translate class="my-1" (click)="screenshotModal?.toggle()">
        <it-icon name="file" color="warning"></it-icon>it.result.screenshot
      </a>
    }
    @if (html && storageData?.objectId) {
      <a itButton="outline-success" size="xs" translate class="my-1" (click)="downloadhtml()">
        <it-icon name="files" color="success"></it-icon>it.result.html
      </a>
    }
    @if(screenshot && storageData?.screenshotId) {
      <it-modal #screenshotModal="itModal" size="lg" scrollable="true" footerShadow="true">
        <it-icon color="primary" name="info-circle" beforeTitle></it-icon>
        <ng-container modalTitle><span class="text-primary">{{ denominazione }}</span></ng-container>
        <div class="overflow-y">
          <img src="{{ imagesrc }}" class="w-100 h-100">
        </div>  
      </it-modal>
    }
    @if(html && storageData?.objectId) {
      <it-modal #htmlModal="itModal" size="lg" scrollable="true" footerShadow="true">
        <it-icon color="primary" name="info-circle" beforeTitle></it-icon>
        <ng-container modalTitle><span class="text-primary"> {{ denominazione }} </span></ng-container>
        <it-tab-container [dark]="true">
          <it-tab-item label="HTML" [icon]="'file'" [active]="true">
            <div class="e2e-trusted-html" [innerHTML]="safeHtml| highlightedText:searchText" ></div>
          </it-tab-item>  
          <it-tab-item label="Sorgente" [icon]="'file'">
            <div>
              {{safeHtml}}
            </div>
          </it-tab-item>  
        </it-tab-container>  
      </it-modal>
    }
  `
})
export class ShowStorageResultComponent {

  constructor(
    protected httpClient: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }
  @Input() screenshot: boolean = false;
  @Input() html: boolean = false;

  @Input() denominazione: string = null;

  @Input() storageData: StorageData = null;
  @Input() searchText: string;

  @ViewChild('htmlModal') htmlModal: any;
  @ViewChild('screenshotModal') screenshotModal: any;

  safeHtml: string = '';

  get imagesrc(): string {
    return `${environment.apiUrl}/${this.storageData?.screenshotBucket}/${this.storageData?.screenshotId}`;
  }

  downloadhtml() {
    if (this.storageData?.objectBucket && this.storageData?.objectId) {
      this.httpClient.get(`${environment.apiUrl}/${this.storageData?.objectBucket}/${this.storageData?.objectId}`, {
        responseType: 'text'
      }).subscribe((base64: string) => {
        let result = base64.replace("\'","").replace("b", "").replace("\'","");
        this.safeHtml = atob(result); 
        this.changeDetectorRef.detectChanges();
        this.htmlModal.toggle();
      });
    }
  }
}
