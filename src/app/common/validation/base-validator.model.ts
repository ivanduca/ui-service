import {Injector} from '@angular/core';

export abstract class BaseValidator {

  private static INJECTOR_KEY = 'injector';

  public context = {};

  constructor() {}

  public addValue(key: string, value: any) {
    this.context[key] = value;
  }

  public getValue(key) {
    return this.context[key];
  }

  public addInjector(injector: Injector) {
    this.context[BaseValidator.INJECTOR_KEY] = injector;
  }

  public getInjector(): Injector {
    return this.context[BaseValidator.INJECTOR_KEY];
  }

}
