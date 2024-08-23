import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AutoLoginAllRoutesGuard } from 'angular-auth-oidc-client';

const authRoutes: Routes = [
  { 
    path: 'auth/signin', 
    canActivate: (environment.oidc.enable)?[AutoLoginAllRoutesGuard]:[], 
    component: SigninComponent 
  }
];

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild(authRoutes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
