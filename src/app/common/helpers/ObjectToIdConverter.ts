import {JsonConverter, JsonCustomConvert} from 'json2typescript';

@JsonConverter
export class ObjectToIdConverter implements JsonCustomConvert<any> {
    serialize(obj: any): any {
        if (!obj)
            return null;
        return obj.id || obj;
    }
    deserialize(obj: any): any {
        return obj;
    }
}