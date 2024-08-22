import { NgModule} from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

const appRoutes: Routes = [
  { path: '**', redirectTo: 'error/not-found', pathMatch: 'prefix'},
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingEndModule {

}
