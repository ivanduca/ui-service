import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ValidationHelper } from '../validation/validation-helper';

/**
 * Spring ritorna un messaggio di errore che Angular wrappa in un oggetto HttpErrorResponse.
 *
 * Questa classe fornisce una astrazione sugli errori ritornati da Spring.
 */
export class SpringError {

  public restError: SpringRestError;

  public constructor(public httpErrorResponse: HttpErrorResponse, public translateService: TranslateService) {

    let message = this.httpErrorResponse.error.error;
    if (httpErrorResponse.error.message) {
      message = httpErrorResponse.error.message;
    }
    let i18n = httpErrorResponse.error.i18n;
    if (i18n) {
      this.translateService.get(i18n.key, i18n.params).subscribe((label: string) => {
        message = label;
      })
    }
    this.restError = new SpringRestError(this.httpErrorResponse.error.timestamp,
      message, this.httpErrorResponse.error.path, this.httpErrorResponse.error.errors);
  }

  public isZuulGeneralException() {
    return this.httpErrorResponse.error.exception === 'com.netflix.zuul.exception.ZuulException'
      && this.httpErrorResponse.error.message === 'GENERAL';
  }

  public getRestError(): SpringRestError {
    return this.restError;
  }

  /**
   * Il messaggio di errore al livello della risposta.
   * @returns {string}
   */
  public getRestErrorMessage(): string {
    if (this.isZuulGeneralException()) {
      return 'Il servizio richiesto è momentaneamente non disponibile. Riprovare tra alcuni secondi.';
    }
    return this.getRestError().getMessage();
  }

  /**
   * Gli errori di validazione per quel field.
   * @param {string} field
   * @returns {string[]}
   */
  public getFieldValidationCodes(field: string): string[] {
    const codes = [];
    if (!this.getRestError() || !this.getRestError().getValidationErrors()) {
      return codes;
    }
    for (const v of this.getRestError().getValidationErrors()) {
      if ( v.field === field) {
        let code = v.code;
        if (ValidationHelper.CONVERSION_ANGULAR_SPRING[code]) {
          code = ValidationHelper.CONVERSION_ANGULAR_SPRING[code];
        }
        codes.push(code);
      }
    }
    return codes;
  }

  /**
   * Gli errori di validazione a livello form.
   * @returns {string[]}
   */
  public getFormValidationMessages(): string[] {
    const messages = [];
    if (!this.getRestError() || !this.getRestError().getValidationErrors()) {
      return messages;
    }
    for (const v of this.getRestError().getValidationErrors()) {
      if (!v.code) {
        messages.push(v.message);
      }
    }
    return messages;
  }

}

/**
 * Response error Spring Rest.
 */
class SpringRestError {

  constructor(public timestamp: string,
              private message: string,
              private path: string,
              private errors: SpringValidationError[],
  ) {}

  public getMessage() {
    return this.message;
  }

  public getValidationErrors(): SpringValidationError[] {
    return this.errors;
  }
}

/**
 * Validation error Spring Rest.
 */
class SpringValidationError {

  constructor(public field: string,             // descr
              public rejectedValue: string,     // null
              public object: string,            // ruolo
              public message: string,           // must be unique
              public code: string) {}           // NotBlank

}
