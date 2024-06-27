import { throwError as observableThrowError, of as observableOf, Observable, switchMap, map, catchError} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../common/controller/common.service';
import { ApiMessageService, MessageType } from '../../core/api-message.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { TranslateService } from '@ngx-translate/core';
import { Workflow } from './workflow.model';
import { Rule } from '../rule/rule.model';
import { SpringError } from '../../common/model/spring-error.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class ConductorService extends CommonService<Workflow> {

  public constructor(protected httpClient: HttpClient,
                     protected apiMessageService: ApiMessageService,
                     protected router: Router,
                     protected translateService: TranslateService,                     
                     protected configService: ConfigService) {
    super(httpClient, apiMessageService, translateService, router, configService);
  }
  public static AMMINISTRAZIONE_TRASPARENTE_FLOW: string = 'crawler_amministrazione_trasparente';

  protected createNewInstance(): new () => any {
    return Workflow;
  }

  public getApiService(): string {
    return `conductor-server`;
  }
  
  public getRoute(): string {
    return '';
  }

  public getApiPath(): string {
    return `/api/workflow`;
  }

  protected get nameOfResults(): string {
    return undefined;
  }

  public getAll(filter?: {}, path?: string): Observable<Workflow[]> {
    if (!path) {
      path = `/${ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW}/correlated/${ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW}`;
    }
    return super.getAll(filter, path).pipe(switchMap((workflows: Workflow[]) => {
      return observableOf(workflows.sort((a,b) => (a.startTime < b.startTime)? 1 : -1));
    }));
  }

  public lastWorflow(): Observable<Workflow> {
    return this.getAll({
      includeClosed: true,
      includeTasks: false
    }).pipe(switchMap((workflows: Workflow[]) => {
      return observableOf(workflows[0]);
    }));
  }
  
  public startMainWorkflow(codiceIpa?: string): Observable<string> {
    return this.configService.getGateway()
      .pipe(
        switchMap((gateway) => {
          return this.httpClient.post(`${gateway}${this.getApiService()}/api/workflow`, this.inputParamter(codiceIpa), {responseType: 'text'})
            .pipe(
              map((result: string) => {
                return result;
              }),
              catchError((httpErrorResponse: HttpErrorResponse) => {
                const springError = new SpringError(httpErrorResponse, this.translateService);
                this.apiMessageService.sendMessage(MessageType.ERROR, springError.getRestErrorMessage());
                return observableThrowError(springError);
              })
            );
        })
    );
  }

  public inputParamter(codiceIpa?: string): any {
    return {
      name: ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW,
      version: 1,
      correlationId: codiceIpa || ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW,
      input: {
        page_size: 1000,
        codice_categoria: ``,
        codice_ipa: codiceIpa,
        id_ipa_from: 0,
        parent_workflow_id: ``,
        execute_child: true,
        crawler_save_object: false,
        crawler_save_screenshot: false,
        rule_name: Rule.AMMINISTRAZIONE_TRASPARENTE,
        connection_timeout: 15000,
        read_timeout: 15000,
        connection_timeout_max: 30000,
        read_timeout_max: 30000,
        result_base_url: environment.apiUrl  
      }
    }
  }
}
