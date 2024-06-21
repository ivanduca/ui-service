import {JsonConverter, JsonCustomConvert} from 'json2typescript';

@JsonConverter
export class DateTimeConverter implements JsonCustomConvert<Date> {
    
    serialize(date: Date): number {
        return date.getTime();
    }

    deserialize(date: number): Date {
        if (date === null)
            return null;
        return new Date(date);
    }
}