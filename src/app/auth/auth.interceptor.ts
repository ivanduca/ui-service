import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ConfigService} from '../core/config.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';
import { ConductorService } from '../core/conductor/conductor.service';
import { CompanyService } from '../core/company/company.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private oidcSecurityService: OidcSecurityService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.oidc.enable) {
      if (req.url.indexOf(CompanyService.API_SERVICE) != -1 || 
          req.url.indexOf(ConductorService.API_SERVICE) != -1) {            
        return this.oidcSecurityService.checkAuth().pipe(          
          switchMap((isAuthenticated) => {
            if(!isAuthenticated) {
              return this.oidcSecurityService.forceRefreshSession().pipe(
                switchMap(({accessToken}) => {
                  const copiedReq = req.clone({
                    headers: req.headers
                      .set(`Authorization`, `Bearer ${accessToken}`)
                  });
                  return next.handle(copiedReq);  
                })
              );
            } else {
              return this.oidcSecurityService.getAccessToken().pipe(
                switchMap((accessToken) => {
                  const copiedReq = req.clone({
                    headers: req.headers
                      .set(`Authorization`, `Bearer ${accessToken}`)
                  });
                  return next.handle(copiedReq);  
                })
              );
            }
          })
        );  
      } else {
        return next.handle(req);
      }
    } else {
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
}
