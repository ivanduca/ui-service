import { Pipe, PipeTransform } from '@angular/core';
import {Helpers} from '../../common/helpers/helpers';

@Pipe({
  name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {

  transform(value: string, args: any[]): string {
    if (value === null) {
      return 'not_assigned';
    }
    return Helpers.capitalizeName(value);
  }

}
