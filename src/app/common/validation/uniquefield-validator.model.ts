
import {of as observableOf, timer as observableTimer, Observable} from 'rxjs';
import {BaseValidator} from './base-validator.model';
import {FormControl, ValidationErrors} from '@angular/forms';
import {Injector, Type} from '@angular/core';
import {Base} from '../model/base.model';
import {ValidationHelper} from './validation-helper';

import { switchMap, map } from 'rxjs/operators';


/**
 * Utilizzoentity
 *
 * 1) Costruire il validatore
 * const descrUnique = new UniqueFieldValidator(this.injector, this.entity, TipoEntitaLocaleService, 'existing');
 *
 * 2) Passare il validatore negli async validators
 * new FormControl(controlName, ..., [descrUnique.validator.bind(descrUnique)])
 */
export class UniqueFieldValidator extends BaseValidator {

  private static ENTITY_KEY = 'entity';
  private static SERVICE_CLASS_KEY = 'serviceClass';
  private static SERVICE_METHOD_KEY = 'serviceMethod';
  private static MESSAGE = 'message';

  constructor(injector: Injector, entity: Base, serviceClass: Type<any>, serviceMethod: string, message?: string) {
    super();
    this.addValue(UniqueFieldValidator.ENTITY_KEY, entity);
    this.addValue(UniqueFieldValidator.SERVICE_CLASS_KEY, serviceClass);
    this.addValue(UniqueFieldValidator.SERVICE_METHOD_KEY, serviceMethod);
    this.addValue(UniqueFieldValidator.MESSAGE, message || ValidationHelper.UNIQUE_FIELD);    
    this.addInjector(injector);

  }

  /**
   * La funzione di validazione.
   *
   * @param {FormControl} control
   * @returns {{}}
   */
  public validator(control: FormControl): Observable<ValidationErrors | null> {
    return observableTimer(600).pipe(switchMap(() => {
      const entity: Base = this.getValue(UniqueFieldValidator.ENTITY_KEY);
      const service = this.getInjector().get(this.getValue(UniqueFieldValidator.SERVICE_CLASS_KEY));
      const id = entity ? entity.getId() : null;
      return service[this.getValue(UniqueFieldValidator.SERVICE_METHOD_KEY)](control.value, id).pipe(map(result => {
        return result ? ValidationHelper.getValidator(this.getValue(UniqueFieldValidator.MESSAGE)) : null;
      }));
    }));
  }

}
