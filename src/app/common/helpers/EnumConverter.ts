import { JsonConverter, JsonCustomConvert } from "json2typescript";

@JsonConverter
export class EnumConverter<T> implements JsonCustomConvert<any> {
  enumType: {[key: string]: any};

  constructor(enumType: {[key: string]: any}) {
    this.enumType = enumType;
  }

  serialize(data: any): string {
    if (!data) {
      return null;
    }
    return data.toString(); // Return as a number if that is desired
  }

  deserialize(data: any): T {
    if (data === undefined || data == null) {
      return undefined;
    }
    const key = Object.keys(this.enumType)
        .filter(key => this.enumType[key] === data)[0];
    return <T>this.enumType[<string>key];     
  }
}