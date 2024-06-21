
import { of as observableOf, Observable, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config.model';
import { TranslateLoader } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService implements TranslateLoader{

  public static CONFIG_URL = '/assets/config/config.json';
  
  public static URL_OAUTH_LOGIN = '/security/login';
  public static URL_OAUTH_LOGOUT = '/security/logout';

  public static URL_SSO_LOGIN = '/security/sso/login';

  public static API_BASE = '';
  
  private config: Config = null;

  constructor(private httpClient: HttpClient) {}

  getGateway(): Observable<string> {
    return observableOf(environment.apiUrl);
  }

  getApiBase(): Observable<string> {
    return this.getGateway().pipe(map( gateway => {
      return gateway + ConfigService.API_BASE;
    }));
  }

  getTranslation(lang: string): Observable<any> {
    return forkJoin(
      [
        this.httpClient.get(`${environment.baseHref}assets/i18n/${lang}.json`)
      ]
    ).pipe(map((data:any) => {
      return {...data[0]};
    }));
  }  
}
