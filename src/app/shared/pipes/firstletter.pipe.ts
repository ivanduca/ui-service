import { Pipe, PipeTransform } from '@angular/core';
import {Helpers} from '../../common/helpers/helpers';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(value: string, args: any[]): string {
    if (value === null) {
      return 'not_assigned';
    }
    return Helpers.firstLetter(value);
  }

}
