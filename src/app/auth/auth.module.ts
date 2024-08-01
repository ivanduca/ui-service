import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TagsModule} from '../shared/tags/tags.module';

import {SigninComponent} from './signin/signin.component';

import {AuthRoutingModule} from './auth-routing.module';
import {AuthGuard} from './auth-guard.service';

// import ngx-translate and the http loader
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CustomTranslationCompiler } from '../common/helpers/translation-compiler';
import { ConfigService } from '../core/config.service';
import { DesignAngularKitModule } from 'design-angular-kit';

export enum ServiceReg {
  UTENTE = 'utente',
}

@NgModule({
  declarations: [
    SigninComponent,
  ],
  exports: [
  ],
  imports: [
    SharedModule,
    TagsModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    CommonModule,
    TranslateModule.forChild({
      compiler: {provide: TranslateCompiler, useClass: CustomTranslationCompiler},
      loader: {
          provide: TranslateLoader,
          useFactory: CustomHttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    DesignAngularKitModule.forRoot()
  ],
  providers: [
    AuthGuard,
  ]
})
export class AuthModule {}

// required for AOT compilation
export function CustomHttpLoaderFactory(http: HttpClient) {
  return new ConfigService(http);
}