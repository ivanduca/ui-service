import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(value: any): any {
    let days: any;
    let seconds: any;
    let minutes: any;
    let hours:   any;

    seconds = Math.floor(((value / 1000) % 60));
    minutes = Math.floor((value / (1000 * 60) % 60));
    hours   = Math.floor((value / (1000 * 60 * 60) % 24));
    days    = Math.floor((value / (1000 * 60 * 60 * 24)));
    return this.format(seconds, minutes, hours, days);
  }

  private format(seconds, minutes, hours, days) {
    let secondslabel = this.translateService.instant('it.time.seconds.' + (seconds === 1?'singular':'plural'));
    let minuteslabel = this.translateService.instant('it.time.minutes.' + (minutes === 1?'singular':'plural'));
    let hourslabel = this.translateService.instant('it.time.hours.' + (hours === 1?'singular':'plural'));
    let dayslabel = this.translateService.instant('it.time.days.' + (days === 1?'singular':'plural'));
    let result = '';
    if (seconds > 0) {
      if (minutes > 0 || hours > 0 ||days > 0) {
        result = `e ${seconds} ${secondslabel}`;
      } else {
        result = `${seconds} ${secondslabel}`;
      }
    }

    if (minutes > 0) {
      result = `${minutes} ${minuteslabel} ${result}`;
    }
    if (hours > 0) {
      result = `${hours} ${hourslabel} ${result}`;
    }
    if (days > 0) {
      result = `${days} ${dayslabel} ${result}`;
    }
    return result;
  }
}
