import {JsonConverter, JsonCustomConvert} from 'json2typescript';

@JsonConverter
export class BooleanConverter implements JsonCustomConvert<boolean> {
    serialize(param: boolean): boolean {
        return param;
    }

    deserialize(param: any): boolean {
        if (typeof param === 'boolean')
            return param;
        return param === 'true' ? true : false;
    }
}