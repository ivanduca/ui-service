import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { registerElement } from 'nativescript-angular/element-registry';
registerElement(
  'Fab',
  () => require('@nstudio/nativescript-floatingactionbutton').Fab
);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    NativeScriptCommonModule,
    AppRoutingModule,

    CoreModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
