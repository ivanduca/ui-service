
export class CheckboxModel {

  constructor(public id,
              public label,
              public value,
              public selected,
              public disabled) {}


  public static booleanBox(value: boolean, disabled: boolean = false): CheckboxModel[] {
    return [
      new CheckboxModel('booleanBox', '', true, value, false)
    ];
  }

  public static SEXModel(): CheckboxModel[] {
    return [
      new CheckboxModel('radiomale', 'user.male', 'M', undefined, undefined),
      new CheckboxModel('radiofemale', 'user.female', 'F', undefined, undefined)
    ];
  }

  public static ForeignModel(): CheckboxModel[] {
    return [
      new CheckboxModel('cittadinanzaitaly', 'user.cittadinanza.italy', false, undefined, undefined),
      new CheckboxModel('cittadinanzaforeign', 'user.cittadinanza.foreign', true, undefined, undefined)
    ];
  }

}
