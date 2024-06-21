import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../common/controller/common.service';
import { ApiMessageService } from '../api-message.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { TranslateService } from '@ngx-translate/core';
import { Result } from '../result/result.model';

@Injectable()
export class SearchService extends CommonService<Result>{

  public static ROUTE = 'results';
  
  public constructor(protected httpClient: HttpClient,
                     protected apiMessageService: ApiMessageService, 
                     protected translateService: TranslateService,
                     protected router: Router,
                     protected configService: ConfigService) {
    super(httpClient, apiMessageService, translateService, router, configService);
  }

  protected createNewInstance(): new () => any {
    return undefined;
  }

  public getApiService(): string {
    return '';
  }

  public getApiPath(): string {
    return '/v1/' + this.getRoute();
  }

  public getApiVersion() {
    return 1;
  }

  public getRoute(): string {
    return SearchService.ROUTE;
  }

}
