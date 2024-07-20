import {throwError as observableThrowError,  Observable } from 'rxjs';
import {switchMap, take, catchError} from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ApiMessageService, MessageType } from '../core/api-message.service';
import { ConfigService} from '../core/config.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private inj: Injector,
              private apiMessageService: ApiMessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Le richieste di config non devono essere intercettate
    if (req.url.indexOf(ConfigService.CONFIG_URL) >= 0) {
      return next.handle(req);
    }

    // Le richieste di token / refresh token non devono essere intercettate
    if (req.url.indexOf(ConfigService.URL_OAUTH_LOGIN) >= 0) {
      return next.handle(req);
    }
    return next.handle(req);

  }
}
