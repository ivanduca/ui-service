import {JsonConverter, JsonCustomConvert} from 'json2typescript';

@JsonConverter
export class UppercaseConverter implements JsonCustomConvert<string> {
    serialize(value: string): string {
        return value ? value.toUpperCase(): undefined;
    }
    deserialize(value: any): string {
        return value;
    }
}
