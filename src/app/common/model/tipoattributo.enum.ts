import {Enum} from './enum.model';

export class TipoAttributo extends Enum {

  constructor(public value: string) {
    super(value);
  }

  public static values(): TipoAttributo[] {
    return [
      new TipoAttributo('COLOR'),
      new TipoAttributo('TEXT')
    ];
  }

  isColor() {
    return this.getEnumValue() ===  'COLOR';
  }

  isText() {
    return this.getEnumValue() ===  'TEXT';
  }

}
