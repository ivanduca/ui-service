import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { SearchComponent } from './core/search/search.component';

export const MODULE_CONFIGURAZIONE = 'configurazione';


export const routes: Routes = [
  { path: "", redirectTo: "/auth/signin", pathMatch: "full" },  
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: MODULE_CONFIGURAZIONE, loadChildren: () => import('./+configurazione/configurazione.module').then(m => m.ConfigurazioneModule)}
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
