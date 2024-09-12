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
import { AuthGuard } from '../../auth/auth-guard';
import { RoleEnum } from '../../auth/role.enum';

@Injectable()
export class ConductorService extends CommonService<Workflow> {

  public constructor(protected httpClient: HttpClient,
                     protected apiMessageService: ApiMessageService,
                     protected router: Router,
                     protected translateService: TranslateService,
                     private authGuard: AuthGuard,
                     protected configService: ConfigService) {
    super(httpClient, apiMessageService, translateService, router, configService);
  }
  public static AMMINISTRAZIONE_TRASPARENTE_FLOW: string = 'crawler_amministrazione_trasparente';
  public static API_SERVICE = `conductor-server`;

  protected createNewInstance(): new () => any {
    return Workflow;
  }

  public getApiService(): string {
    return ConductorService.API_SERVICE;
  }
  
  public getRoute(): string {
    return '';
  }

  public getApiPath(): string {
    return `/api/workflow`;
  }

  getGateway(): Observable<string> {
    return observableOf(environment.conductorApiUrl);
  }
  
  protected get nameOfResults(): string {
    return undefined;
  }
  
  public getAll(filter?: {}, path?: string): Observable<Workflow[]> {
    if (!path) {
      path = `/${ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW}/correlated/${ConductorService.AMMINISTRAZIONE_TRASPARENTE_FLOW}`;
    }
    return this.authGuard.hasRole([RoleEnum.ADMIN, RoleEnum.SUPERUSER]).pipe(switchMap((hasRole: boolean) => {
      return super.getAll(filter, path).pipe(switchMap((workflows: Workflow[]) => {
        return observableOf(
          workflows
            .filter((workflow: Workflow) => {       
              if (!hasRole) {
                return workflow.isCompleted;
              }
              return true;
            })
            .sort((a,b) => (a.startTime < b.startTime)? 1 : -1)
        );
      }));  
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

  public lastWorflowCompleted(): Observable<Workflow> {
    return this.getAll({
      includeClosed: true,
      includeTasks: false
    }).pipe(switchMap((workflows: Workflow[]) => {      
      return observableOf(workflows.filter((workflow: Workflow) => {
        return workflow.isCompleted;
      })[0]);
    }));
  }

  public startMainWorkflow(codiceIpa?: string): Observable<string> {
    return this.getGateway()
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
        page_size: 10,
        codice_categoria: ``,
        codice_ipa: codiceIpa,
        id_ipa_from: 0,
        parent_workflow_id: ``,
        execute_child: true,
        crawler_save_object: false,
        crawler_save_screenshot: false,
        rule_name: Rule.AMMINISTRAZIONE_TRASPARENTE,
        connection_timeout: 30000,
        read_timeout: 30000,
        connection_timeout_max: 60000,
        read_timeout_max: 60000,
        result_base_url: environment.apiUrl,
        crawler_child_type: `SUB_WORKFLOW`  
      }
    }
  }
}
