import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {CommonService} from '../../common/controller/common.service';
import {ApiMessageService, MessageType} from '../../core/api-message.service';
import {Router} from '@angular/router';
import {ConfigService} from '../../core/config.service';
import { TranslateService } from '@ngx-translate/core';
import { Company } from './company.model';

@Injectable()
export class CompanyService extends CommonService<Company> {

  public static ROUTE = 'companies';
  static PAGE_OFFSET = 24;

  public constructor(protected httpClient: HttpClient,
                     protected apiMessageService: ApiMessageService,
                     protected router: Router,
                     protected translateService: TranslateService,                     
                     protected configService: ConfigService) {
    super(httpClient, apiMessageService, translateService, router, configService);
  }

  protected createNewInstance(): new () => any {
    return Company;
  }

  public getApiService(): string {
    return 'public-sites-service';
  }

  public getRoute(): string {
    return CompanyService.ROUTE;
  }

  public getPageOffset(): number {
    return CompanyService.PAGE_OFFSET;
  }

  
}
