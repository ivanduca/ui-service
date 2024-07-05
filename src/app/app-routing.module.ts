import { NgModule} from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { HomeComponent} from './core/home/home.component';
import { SearchComponent } from './core/search/search.component';
import { CompanySearchComponent } from './core/company/company-search.component';
import { CompanyMapComponent } from './core/company/company-map.component';
import { CompanyGraphComponent } from './core/company/company-graph.component';
import { CreditsComponent } from './core/credits/credits.component';
import { ItErrorPageComponent } from 'design-angular-kit';
import { PrivacyPolicyComponent } from './core/privacy-policy/privacy-policy.component';
import { NoteLegaliComponent } from './core/note-legali/note-legali.component';
import { ResultPieComponent } from './core/result/result-pie.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'company-search', component: CompanySearchComponent },
  { path: 'company-map', component: CompanyMapComponent },
  { path: 'company-graph', component: CompanyGraphComponent },
  { path: 'result-pie', component: ResultPieComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'note-legali', component: NoteLegaliComponent },
  { path: 'error/not-found', component: ItErrorPageComponent, data: { errorCode: 404 } },
  { path: 'error/forbidden', component: ItErrorPageComponent, data: { errorCode: 403 } },
  { path: 'error/server-error', component: ItErrorPageComponent, data: { errorCode: 500 } },    
  { path: 'error/not-found-no-back', component: ItErrorPageComponent, data: { errorCode: 404, showBackButton: false } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true, scrollPositionRestoration: 'enabled' 
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
