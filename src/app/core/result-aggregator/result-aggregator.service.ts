import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../common/controller/common.service';
import { ApiMessageService } from '../api-message.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { TranslateService } from '@ngx-translate/core';
import { Result } from '../result/result.model';

@Injectable()
export class ResultAggregatorService extends CommonService<Result> {

  public static ROUTE = 'result-aggregator-service';
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
    return `result-aggregator-service`;
  }

  public getRoute(): string {
    return ResultAggregatorService.ROUTE;
  }

  public getPageOffset(): number {
    return ResultAggregatorService.PAGE_OFFSET;
  }

}
