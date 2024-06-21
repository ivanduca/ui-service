import {BaseValidator} from './base-validator.model';
import {Helpers} from '../helpers/helpers';
import {FormControl} from '@angular/forms';

/**
 * Utilizzo
 *
 * 1) Costruire il validatore
 * const periodValidator = new PeriodValidator(from, to);
 *
 * 2) Passare il validatore
 * new FormControl(controlName, [periodValidator.validator.bind(periodValidator)])
 */
export class PeriodValidator extends BaseValidator {

  public static FROM_KEY = 'fromKey';
  public static TO_KEY = 'toKey';

  constructor(from, to) {
    super();
    this.addValue(PeriodValidator.FROM_KEY, Helpers.buildDate(from));
    this.addValue(PeriodValidator.TO_KEY, Helpers.buildDate(to));
  }

  /**
   * La funzione di validazione.
   *
   * @param {FormControl} control
   * @returns {{}}
   */
  public validator(control: FormControl) {
    const message = this.validationMessage(control.value);
    if (message) {
      const obj = {};
      obj[message] = true;
      return obj;
    }
    return {};
  }

  private fromIsValid(date) {
    const value = Helpers.buildDate(date);
    return !this.getFrom() || (!value || this.dateEquals(this.getFrom(), value) || this.getFrom() <= value);
  }

  private toIsValid(date) {
    const value = Helpers.buildDate(date);
    return !this.getTo() || (!value || this.dateEquals(this.getFrom(), value) || this.getFrom() >= value);
  }

  private getFrom() {
    return this.getValue(PeriodValidator.FROM_KEY);
  }

  private getTo() {
    return this.getValue(PeriodValidator.TO_KEY);
  }

  public validationMessage(value): string {
    const fromIsInvalid = !this.fromIsValid(value);
    const toIsInvalid = !this.toIsValid(value);
    // Ok
    if (!fromIsInvalid && !toIsInvalid) {
      return null;
    }
    // Error
    // Osservazione: se siamo in errore il limite è definito
    if (fromIsInvalid && toIsInvalid) {
      return 'Deve essere compreso fra ' + Helpers.showDate(this.getFrom()) + ' e ' + Helpers.showDate(this.getTo());
    }
    if (fromIsInvalid) {
      return 'Deve essere uguale o successivo a ' + Helpers.showDate(this.getFrom());
    }
    if (toIsInvalid) {
      return 'Deve essere precedente o uguale ' + Helpers.showDate(this.getTo());
    }
    return null;
  }

  private dateEquals(date1: Date, date2: Date) {
    // const day = date2.getDate();
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

}
