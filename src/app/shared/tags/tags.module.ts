import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';

import {ShowTextComponent} from './show/show-text.component';
import {ShowListTextComponent} from './show/show-list-text.component';

import {ShowURLComponent} from './show/show-url.component';
import {ShowEMailComponent} from './show/show-email.component';
import {ShowTextModalComponent} from './show/show-text-modal.component';
import {ShowTextPopoverComponent} from './show/show-text-popover.component';
import {LayoutTitleComponent} from './layout/layout-title.component';
import {RouterModule} from '@angular/router';
import {ShowLayoutComponent} from './show/show-layout.component';

import {ListLayoutComponent} from './list/list-layout.component';
import {GridLayoutComponent} from './list/grid-layout.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ListItemCompanyComponent} from './list/list-item-company.component';
import {ListItemResultComponent} from './list/list-item-result.component';
import {ShowStorageResultComponent} from './show/show-storage-result.component';
import {ShowWorkflowHistoryComponent} from './show/show-workflow-history.component';
import {ShowHtmlPageComponent} from './show/show-html-page.component';

import {ListHeaderLayoutComponent} from './list/list-header-layout.component';
import {ShowEnumComponent} from './show/show-enum.component';
import {ListPaginationComponent} from './list/list-pagination.component';

import {ShowMultiComponent} from './show/show-multi.component';
import {LayoutBreadcrumbsComponent} from './layout/layout-breadcrumbs.component';
import {LayoutLegendComponent} from './layout/layout-legend.component';
import {LayoutWaitComponent} from './layout/layout-wait.component';
import {ShowColorComponent} from './show/show-color.component';
import {ShowBooleanComponent} from './show/show-boolean.component';

// import ngx-translate and the http loader
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {CustomTranslationCompiler } from '../../common/helpers/translation-compiler';
import {ConfigService } from '../../core/config.service';

import { DesignAngularKitModule } from 'design-angular-kit';

@NgModule({
    declarations: [
        // Layout
        LayoutTitleComponent,
        LayoutBreadcrumbsComponent,
        LayoutLegendComponent,
        LayoutWaitComponent,
        // Show
        ShowLayoutComponent,
        ShowEnumComponent,
        ShowTextComponent,
        ShowListTextComponent,
        ShowURLComponent,
        ShowEMailComponent,
        ShowTextModalComponent,
        ShowTextPopoverComponent,
        ShowMultiComponent,
        ShowColorComponent,
        ShowBooleanComponent,
        ShowStorageResultComponent,
        ShowWorkflowHistoryComponent,
        ShowHtmlPageComponent,
        // List
        ListLayoutComponent,
        GridLayoutComponent,
        ListHeaderLayoutComponent,
        ListItemCompanyComponent,
        ListItemResultComponent,
        ListPaginationComponent,
    ],
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        TranslateModule.forChild({
            compiler: { provide: TranslateCompiler, useClass: CustomTranslationCompiler },
            loader: {
                provide: TranslateLoader,
                useFactory: CustomHttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        DesignAngularKitModule.forRoot()
    ],
    exports: [
        // Layout
        LayoutTitleComponent,
        LayoutBreadcrumbsComponent,
        LayoutLegendComponent,
        LayoutWaitComponent,
        // Show
        ShowEnumComponent,
        ShowTextComponent,
        ShowListTextComponent,
        ShowURLComponent,
        ShowEMailComponent,
        ShowTextModalComponent,
        ShowTextPopoverComponent,
        ShowMultiComponent,
        ShowColorComponent,
        ShowBooleanComponent,
        ShowStorageResultComponent,
        ShowWorkflowHistoryComponent,
        ShowHtmlPageComponent,
        // List
        ListLayoutComponent,
        GridLayoutComponent,
        ListHeaderLayoutComponent,
        ListItemCompanyComponent,
        ListItemResultComponent,
        ListPaginationComponent,
    ],
    providers: [
    ]
})
export class TagsModule {}


// required for AOT compilation
export function CustomHttpLoaderFactory(http: HttpClient) {
  return new ConfigService(http);
}