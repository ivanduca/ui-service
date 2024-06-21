import { NgModule} from '@angular/core';
import { CoreRoutingModule} from './core-routing.module';
import { HeaderComponent} from './header/header.component';
import { FooterComponent} from './footer/footer.component';


import { HomeComponent} from './home/home.component';
import { SearchComponent} from './search/search.component';
import { SearchService} from './search/search.service';

import { AppRoutingModule} from '../app-routing.module';
import { SharedModule} from '../shared/shared.module';
import { TagsModule} from '../shared/tags/tags.module';

import { NotificationsService, SimpleNotificationsModule} from 'angular2-notifications';
import { ApiMessageService} from './api-message.service';
import { ConfigService} from './config.service';
import { NavigationService} from './navigation.service';

import { AuthModule} from '../auth/auth.module';

import { CreditsComponent } from './credits/credits.component';

import { CompanyListComponent} from './company/company-list.component';
import { CompanySearchComponent} from './company/company-search.component';
import { CompanyMapComponent} from './company/company-map.component';
import { CompanyGraphComponent} from './company/company-graph.component';
import { CompanyService } from './company/company.service';

import { ConductorService } from './conductor/conductor.service';
import { WorkflowCardComponent } from './conductor/workflow.component';

import { ResultService } from './result/result.service';
import { ResultListComponent } from './result/result-list.component';

import { ResultAggregatorService } from './result-aggregator/result-aggregator.service';

import { RuleService } from './rule/rule.service';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AccordionModule } from 'ngx-bootstrap/accordion';

// import ngx-translate and the http loader
import { TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient} from '@angular/common/http';
import { CustomTranslationCompiler } from '../common/helpers/translation-compiler';

import { DesignAngularKitModule } from 'design-angular-kit';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { NgSelectModule } from '@ng-select/ng-select';

/**
 * Nel core module inserisco tutti i components necessari all'avvio dell'applicazione.
 * Esempio Pagina Iniziale ed Header.
 * Deve essere importato esclusivamente da AppModule.
 *
 * Questo modulo inoltre fornisce l'istanza di tutti quei servizi singleton necessari all'applicazione
 * Esempio: notificationService, apiMessageService.
 */
@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        SearchComponent,
        CompanyListComponent,
        CompanySearchComponent,
        CompanyMapComponent,
        CompanyGraphComponent,
        ResultListComponent,
        WorkflowCardComponent,
        CreditsComponent
    ],
    imports: [
        AppRoutingModule,
        CoreRoutingModule,
        SharedModule,
        TagsModule,
        AuthModule,
        FormsModule,        
        ReactiveFormsModule,
        InfiniteScrollModule,
        AccordionModule,
        ButtonsModule.forRoot(),
        TranslateModule.forChild({
            compiler: { provide: TranslateCompiler, useClass: CustomTranslationCompiler },
            loader: {
                provide: TranslateLoader,
                useFactory: CustomHttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        CollapseModule.forRoot(),
        ProgressbarModule.forRoot(),
        SimpleNotificationsModule.forRoot(), // Le notifiche (per ora) vengono tutte generate nell'header component.
        DesignAngularKitModule.forRoot(),
        LeafletModule,
        LeafletMarkerClusterModule,
        NgSelectModule
    ],
    exports: [
        AuthModule,
        SharedModule,
        TagsModule,
        HomeComponent,
        SearchComponent,
        HeaderComponent,
        FooterComponent,
        CompanyListComponent,
        CreditsComponent,
        ResultListComponent,
        CompanySearchComponent,
        CompanyMapComponent,
        CompanyGraphComponent,
        WorkflowCardComponent,
        DesignAngularKitModule
    ],
    providers: [
        // Capire il discorso del root-injector e child-injector.
        ApiMessageService,
        NotificationsService,
        ConfigService,
        NavigationService,
        CompanyService,
        ResultService,
        ResultAggregatorService,
        ConductorService,
        RuleService,
        SearchService
    ]
})
export class CoreModule {}

// required for AOT compilation
export function CustomHttpLoaderFactory(http: HttpClient) {
  return new ConfigService(http);
}