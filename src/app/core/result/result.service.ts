import { Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CommonService} from '../../common/controller/common.service';
import { ApiMessageService, MessageType} from '../api-message.service';
import { Router} from '@angular/router';
import { ConfigService} from '../config.service';
import { TranslateService } from '@ngx-translate/core';
import { Result } from './result.model';
import { of as observableOf, throwError as observableThrowError, Subject, Observable, pipe, map, catchError} from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { SpringError } from '../../common/model/spring-error.model';

@Injectable()
export class ResultService extends CommonService<Result> {

  public static ROUTE = 'results';
  static PAGE_OFFSET = 12;

  public constructor(protected httpClient: HttpClient,
                     protected apiMessageService: ApiMessageService,
                     protected router: Router,
                     protected translateService: TranslateService,                     
                     protected configService: ConfigService) {
    super(httpClient, apiMessageService, translateService, router, configService);
  }

  protected createNewInstance(): new () => any {
    return Result;
  }

  public getApiService(): string {
    return `result-service`;
  }

  public getRoute(): string {
    return ResultService.ROUTE;
  }

  public getPageOffset(): number {
    return ResultService.PAGE_OFFSET;
  }

  public getCSVUrl(workflowId: string, sort: string, terse: boolean): Observable<string> {
    return this.configService.getApiBase()
    .pipe(
      switchMap((apiBase) => {
        return observableOf(apiBase + this.getRequestMapping() + `/csv?workflowId=${workflowId}&terse=${terse}&sort=${sort}`);
      }));
  }

  public downloadCSV(params: HttpParams): Observable<any> {
    return this.configService.getApiBase()
      .pipe(
        switchMap((apiBase) => {
          return this.httpClient.get( apiBase + this.getRequestMapping() + `/csv`, {params: params, responseType: `blob`}).pipe(
              map((result) => {
                return result;
              }),
              catchError( (httpErrorResponse: HttpErrorResponse) => {
                const springError = new SpringError(httpErrorResponse, this.translateService);
                this.apiMessageService.sendMessage(MessageType.ERROR,  springError.getRestErrorMessage());
                return observableThrowError(springError);
              })
            );
        })
      );
  }
  
  public getWorkflowMap(ruleName?: string, workflowIds?: string[], noCache?: boolean): Observable<any> {
    let params = new HttpParams();
    if(ruleName) {
      params = params.set('ruleName', ruleName);
    }
    if (workflowIds) {
      params = params.set('workflowIds', workflowIds.join(','));
    }
    if (noCache) {
      params = params.set('noCache', noCache);
    }
    return this.configService.getApiBase().pipe(
      switchMap((apiBase) => {
        return this.httpClient.get<any>( apiBase + this.getRequestMapping() + `/countAndGroupByWorkflowIdAndStatus`, {params: params})
        .pipe(
          map((result) => {
            try {
              return result;
            } catch (ex) {
              console.log(ex);
              this.apiMessageService.sendMessage(MessageType.ERROR, ex.message);
              observableThrowError(ex);
            }
          }),
          catchError( (httpErrorResponse: HttpErrorResponse) => {
            const springError = new SpringError(httpErrorResponse, this.translateService);
            this.apiMessageService.sendMessage(MessageType.ERROR,  springError.getRestErrorMessage());
            return observableThrowError(springError);
          })
        );
    }));    
  }

}
