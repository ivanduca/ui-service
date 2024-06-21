export abstract class Enum {

  constructor(protected value: string) {}

  public getEnumValue() {
    return this.value;
  }

}
