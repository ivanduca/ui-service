import {JsonConverter, JsonCustomConvert} from 'json2typescript';
import { DatePipe } from '@angular/common';

@JsonConverter
export class ISODateTimeConverter implements JsonCustomConvert<Date> {
    serialize(date: Date): any {
        return new DatePipe('en-US').transform(date,"yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ");
    }
    deserialize(date: any): Date {
        if (date === null)
            return null;
        return new Date(date);
    }
}