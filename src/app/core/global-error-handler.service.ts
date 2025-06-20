import { ErrorHandler, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { SpringError } from '../common/model/spring-error.model';
import { environment } from '../../environments/environment';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private router: Router
  ) { }

  handleError(error: any) {
    if ((error instanceof SpringError && error?.redirectOnError) || !(error instanceof SpringError)) {
      if (error?.httpErrorResponse?.status === 401) {
        if (environment.oidc.enable) {
          this.router.navigate(['auth/signin']);
        } else {
          this.router.navigate(['error/unauthorized']);
        }
      } else {
        this.router.navigate(['error/server-error']);
      }
    }
    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }

}
