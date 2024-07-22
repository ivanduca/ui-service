import { of as observableOf, Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../common/controller/common.service';
import { ApiMessageService, MessageType } from '../api-message.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { TranslateService } from '@ngx-translate/core';
import { Rule } from './rule.model';
import { SpringError } from '../../common/model/spring-error.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class RuleService extends CommonService<Rule> {

  public constructor(protected httpClient: HttpClient,
                     protected apiMessageService: ApiMessageService,
                     protected router: Router,
                     protected translateService: TranslateService,                     
                     protected configService: ConfigService) {
    super(httpClient, apiMessageService, translateService, router, configService);
  }

  protected createNewInstance(): new () => any {
    return Rule;
  }

  public getApiService(): string {
    return 'rule-service';
  }
  
  public getRoute(): string {
    return '';
  }

  public getApiPath(): string {
    return '/v1/rules';
  }

  protected get nameOfResults(): string {
    return 'results';
  }

  getGateway(): Observable<string> {
    return observableOf(environment.ruleApiUrl);
  }

  public getRules(): Observable<Rule> {
    return this.getApiBase()
      .pipe(
        switchMap((apiBase) => {
          return this.httpClient.get<Rule>( apiBase + this.getRequestMapping())
            .pipe(
              map((result) => {
                try {
                  return this._buildInstance(result[Rule.AMMINISTRAZIONE_TRASPARENTE]);
                } catch (ex) {
                  console.log(ex);
                  this.apiMessageService.sendMessage(MessageType.ERROR, ex.message);
                  throwError(ex);
                }
              }),
              catchError( (httpErrorResponse: HttpErrorResponse) => {
                const springError = new SpringError(httpErrorResponse, this.translateService);
                this.apiMessageService.sendMessage(MessageType.ERROR,  springError.getRestErrorMessage());
                return throwError(springError);
              })
            );
        })
      );
  }
}

