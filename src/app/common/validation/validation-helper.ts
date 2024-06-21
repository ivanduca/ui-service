import {AbstractControl, FormGroup, NgControl, ValidationErrors} from '@angular/forms';
import {SpringError} from '../model/spring-error.model';

export class ValidationHelper {

  public static UNIQUE_FIELD = 'UniqueValidator';

  public static CONVERSION_ANGULAR_SPRING = {
    'NotNull': 'required',
    'NotBlank': 'required'
  };

  /**
   * Oggetto ritornato quando un validator da esito di errore.
   * @param {string} code
   * @returns {any}
   */
  public static getValidator(code: string): any {
    const validator = {};
    validator[code] = true;
    return validator;
  }

  /**
   * Utility per recuperare ogni errore dal control, sia sincrono che asyncrono.
   * A oggi Angular mette a disposizione il solo metodo control.hasError() dove andrebbe fornita a priori la chiave.
   * Noi vogliamo che i componenti siano generici quindi gli errori servono tutti.
   * @param {NgControl} control
   * @returns {string[]}
   */
  public static getValidationCodes(control: AbstractControl): string[] {
    const errors: string[] = [];

    const controlErrors: ValidationErrors = control.errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        // FIXME: questo check dei valori andrebbe perfezionato

        if (keyError === '_isScalar' || keyError === 'scheduler' || keyError === '_subscribe') {

        } else if (keyError === 'value') {
          // validatore asincrono
          const value = controlErrors[keyError]; // value = {value: {mustBeUnique: true}}
          Object.keys(value).forEach(errorName => { // errorName = 'mustBeUnique'
            if (value[errorName]) { // true
              errors.push(errorName);
            }
          });
        } else if (controlErrors[keyError]) {
          // validatore sincrono
          errors.push(keyError);       // keyError = 'required' // controlErrors[keyError] = true
        }

      });
    }
    return errors;
  }

  /**
   * Aggiunge ad ogni control della form gli errori presenti nella risposta spring.
   * @param {FormGroup} form
   * @param {SpringError} springError
   */
  public static formAddErrors(form: FormGroup, springError: SpringError): void {

    // errori a livello di form
    const formMessages = springError.getFormValidationMessages();
    if (formMessages && formMessages.length > 0) {
      form.setErrors(formMessages);
    }

    // errori a livello di control
    // per ogni control della form denominato field

    Object.keys(form.controls).forEach(field => {

      const control = form.get(field);

      // ottengo i codici di errore del controllo e del relativo field nella risposta spring.

      const errorCodes = ValidationHelper.mergeValidationCodes(field, control, springError);

      // creo la nuova mappa con i codici di errore
      const map = {};
      let empty = true;
      for (const code of errorCodes) {
        empty = false;
        map[code] = true;
      }

      // applico i nuovi valori al control
      // sembra che la chiamata setErrors tagghi il control come invalid anche se la mappa è vuota
      if (!empty) {
        control.setErrors(map);
      }

    });
  }

  /**
   * Aggiunge al controllo in form l'errore.
   */
  public static formAddError(form: FormGroup, field: string, error: string): void {

    const control = form.controls[field];
    const errorCodes = ValidationHelper.getValidationCodes(control)

    // creo la nuova mappa con i codici di errore
    const map = {};
    for (const code of errorCodes) {
      map[code] = true;
    }
    console.log(map);
    map[error] = true;

    // applico i nuovi valori al control

    control.setErrors(map);
  }

  /**
   * L'unione degli errori nel controllo angular e nella risposta spring.
   * @param {AbstractControl} control
   * @param {SpringRestError} springRestError
   * @returns {any}
   */
  private static mergeValidationCodes(field: string, control: AbstractControl, springError: SpringError) {
    const codes = ValidationHelper.getValidationCodes(control).concat(springError.getFieldValidationCodes(field));
    return ValidationHelper.uniquify(codes);
  }

  private static uniquify(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }
    return a;
  }

  public static showInvalid(controlDir: NgControl, show: boolean) {
    return show
      && controlDir
      && controlDir.control
      && controlDir.dirty
      && !controlDir.pending // && (controlDir.control.dirty || controlDir.control.touched)
      && !controlDir.control.valid;
  }

  public static showValid(controlDir: NgControl, show: boolean) {
    return show
      && controlDir
      && controlDir.control
      && controlDir.dirty
      && !controlDir.pending // && (controlDir.control.dirty || controlDir.control.touched)
      && controlDir.control.valid;
  }
}
