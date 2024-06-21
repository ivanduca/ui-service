import {JsonConverter, JsonCustomConvert} from 'json2typescript';
import { DatePipe } from '@angular/common';

@JsonConverter
export class ISODateConverter implements JsonCustomConvert<Date> {
    serialize(date: Date): any {
        return new DatePipe('en-US').transform(date,"yyyy-MM-dd'T'12:00:00.000ZZZZZ");
    }
    deserialize(date: any): Date {
        if (date === null)
            return null;
        return new Date(date);
    }
}