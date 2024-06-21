import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import { tap } from "rxjs/operators";
import { LoadingStateEnum, LoadingState } from './loading-state.enum';
import { ApiMessageService } from '../core/api-message.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  
  constructor(protected apiMessageService: ApiMessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.apiMessageService.addLoading(new LoadingState(req.url, LoadingStateEnum.START));
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      // if the event is for http response
      if (event instanceof HttpResponse) {
        // stop our loader here
        this.apiMessageService.addLoading(new LoadingState(req.url, LoadingStateEnum.COMPLETE));
      }
    }, (err: any) => {
      // if any error (not for just HttpResponse) we stop our loader
      this.apiMessageService.addLoading(new LoadingState(req.url, LoadingStateEnum.ERORR));
    }));
  }
}
