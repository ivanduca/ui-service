import { ErrorHandler, Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private router: Router) { }

  handleError(error: any) {
    console.error(error);
    this.router.navigate([""]);
    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }

}
